import { redirect } from "next/navigation";
import { isClient, tryCatch } from "@leww/utils";

import { handleErr, type ServerError } from "./app-error";
import { clientSessionToken } from "./session-token";

interface CustomRequestInit extends RequestInit {
  auth?: boolean;
}

type GetToken = (type: "AT" | "RT") => Promise<string | null>;

const ErrUnauthorized = 401;

class FetchRequest {
  private _baseURL: string;
  private _getToken: GetToken | undefined;

  private _refreshPromise: Promise<void> | null = null;
  constructor() {
    this._baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  }

  // Build headers by injecting content-type and tokens
  private async _buildHeaders(
    url: string,
    options: CustomRequestInit,
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      ...(options.hasOwnProperty("headers")
        ? (options.headers as Record<string, string>)
        : {
            "Content-Type": "application/json",
          }),
    };

    // Skip auth if explicitly disabled
    const shouldInjectToken = options.auth !== false;

    if (!shouldInjectToken) return headers;

    if (isClient()) {
      if (this._getToken) {
        const isRotateEndpoint = url.includes("/v1/auth/rotate-token");
        const type = isRotateEndpoint ? "RT" : "AT";
        const { data: token } = await tryCatch(this._getToken(type));

        // can trigger _cancelUserSession here if _getToken is null

        if (token && !isRotateEndpoint) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }
    } else {
      // Server-side: retrieve token from cookies
      const { cookies } = await import("next/headers");
      const _cookies = await cookies();
      const accessToken = _cookies.get("accessToken");
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken.value}`;
      }
    }
    return headers;
  }

  private async _refreshTokenFlow(
    recentFailedResponse: Response,
  ): Promise<void> {
    this._refreshPromise = (async () => {
      const { data: responseRotateToken, error } = await tryCatch<{
        accessToken: string;
        refreshToken: string;
      }>(
        this._handleRequest("/v1/auth/rotate-token", {
          method: "POST",
          body: JSON.stringify({ token: await this._getToken?.("RT") }),
        }),
      );

      if (error) {
        // Refresh failed: log out the user
        // This is my intentional, i want to logout user when rotate token failed
        await tryCatch(
          this._handleRequest(
            `${process.env.NEXT_PUBLIC_HOST_URL}/api/auth/logout`,
            { method: "POST" },
          ),
        );
        clientSessionToken.value = null;
        clientSessionToken.refreshToken = null;
        location.href = "/login";

        // it may never reach here because we back to login page
        // -----------
        // because server don't throw error that why we still can get result from the "data" property
        const { data } = await tryCatch<ServerError>(
          recentFailedResponse.json() as Promise<ServerError>,
        );
        const err = handleErr(data!).withLog(
          "HTTP error failed when cannot rotate token!",
        );
        return Promise.reject(err);
      }

      // Update tokens after successful refresh
      clientSessionToken.value = responseRotateToken.accessToken;
      clientSessionToken.refreshToken = responseRotateToken.refreshToken;

      // Optionally notify next server about new tokens
      await tryCatch(
        this._handleRequest(`${process.env.NEXT_PUBLIC_HOST_URL}/api/auth`, {
          method: "POST",
          body: JSON.stringify({
            accessToken: responseRotateToken.accessToken,
            refreshToken: responseRotateToken.refreshToken,
          }),
        }),
      );
    })().finally(() => {
      // Clear the refresh lock after completion
      this._refreshPromise = null;
    });

    return this._refreshPromise;
  }

  // Handle responses: differentiate JSON and blob responses
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const { data } = await tryCatch<{ data: T }>(
        response.json() as Promise<{ data: T }>,
      );
      return data?.data
        ? Promise.resolve(data.data)
        : (Promise.resolve(data) as Promise<T>);
    }
    return response.blob() as Promise<T>;
  }

  async _handleRequest<T>(
    url: string,
    options: CustomRequestInit = {},
    signal?: AbortSignal,
  ): Promise<T> {
    const headers = await this._buildHeaders(url, options);

    // ✅ Check if the URL is a full URL (starts with http or https)
    const fullUrl = /^https?:\/\//.test(url) ? url : `${this._baseURL}${url}`;

    const { data: response } = await tryCatch(
      fetch(fullUrl, {
        ...options,
        headers,
        signal,
      }),
    );

    if (!response?.ok) {
      if (response?.status === ErrUnauthorized) {
        // redirect to login page if when this is running on server
        if (!isClient()) redirect("/login");

        // client logic
        // Check if a refresh is already in progress
        // Use _refreshPromise as a lock to avoid multiple refreshes
        if (!Boolean(this._refreshPromise)) {
          await this._refreshTokenFlow(response);
        } else {
          await this._refreshPromise;
        }

        return this._handleRequest(url, options, signal);
      }

      const { data } = await tryCatch<ServerError>(
        response?.json() as Promise<ServerError>,
      );

      const err = handleErr(data!).wrap(new Error("HTTP error failed!"));
      return Promise.reject(err);
    }

    return this.handleResponse<T>(response);
  }

  setAuthGetter(getToken: GetToken | undefined) {
    this._getToken = getToken;
  }
}

export default new FetchRequest();

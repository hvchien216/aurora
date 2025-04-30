import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { extractUrl, httpRequest, tryCatch } from "@leww/utils";
import { jwtDecode } from "jwt-decode";

import { type TokenPayload } from "~/types";

import { type CustomMiddleware } from "./chain";
import { isAuthRoute, isPrivateRoute } from "./utils";

export function withAuth(middleware: CustomMiddleware) {
  return async (req: NextRequest, ev: NextFetchEvent, res: NextResponse) => {
    const { path } = extractUrl(req);
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken && !accessToken && isPrivateRoute(path)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if ((isAuthRoute(path) || isPrivateRoute(path)) && refreshToken) {
      // TODO: should rotate token if accessToken is almost expired
      if (accessToken) {
        return middleware(req, ev, res);
      }

      // even accessToken is null, we can still check refreshToken
      // accessToken is expired, we need to rotate it
      const { data: responseRotateToken, error } = await tryCatch<{
        accessToken: string;
        refreshToken: string;
      }>(
        httpRequest.post("/v1/auth/rotate-token", {
          token: refreshToken,
        }),
      );

      if (error) {
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        return NextResponse.redirect(new URL(`/login`, req.url));
      }

      const decodedAccessToken = jwtDecode<TokenPayload>(
        responseRotateToken.accessToken,
      );
      const decodedRefreshToken = jwtDecode<TokenPayload>(
        responseRotateToken.refreshToken,
      );

      const accessTokenExpiresAt = new Date(decodedAccessToken.exp * 1000);
      const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp * 1000);
      cookieStore.set("accessToken", responseRotateToken.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: accessTokenExpiresAt,
      });

      cookieStore.set("refreshToken", responseRotateToken.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: refreshTokenExpiresAt,
      });

      return middleware(req, ev, res);
    }

    return NextResponse.rewrite(new URL(path, req.url));
  };
}

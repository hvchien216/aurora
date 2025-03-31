import fetchRequest from "./fetch-base";

class HttpRequest {
  private _baseRequest: typeof fetchRequest;

  constructor(baseRequest: typeof fetchRequest) {
    this._baseRequest = baseRequest;
  }

  async get<T>(url: string, signal?: AbortSignal): Promise<T> {
    return this._baseRequest._handleRequest<T>(url, { method: "GET" }, signal);
  }

  async post<T>(url: string, data?: unknown, signal?: AbortSignal): Promise<T> {
    return this._baseRequest._handleRequest<T>(
      url,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      signal,
    );
  }
}

export const httpRequest = new HttpRequest(fetchRequest);

interface IFetchRequest {
  _handleRequest<T>(
    url: string,
    options?: RequestInit,
    signal?: AbortSignal,
  ): Promise<T>;
}
class HttpRequest {
  private _baseRequest: IFetchRequest;

  constructor(baseRequest: IFetchRequest) {
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

// Defer the initialization to avoid circular dependency
let _httpRequest: HttpRequest;

export function getHttpRequest() {
  if (!_httpRequest) {
    // Dynamic import to break circular dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fetchRequest = require("./fetch-base").default;
    _httpRequest = new HttpRequest(fetchRequest);
  }
  return _httpRequest;
}

export const httpRequest = getHttpRequest();

class SessionToken {
  private _value: string | null = null;
  private _refreshToken: string | null = null;
  private _timestamp: number | null = null;
  private _refreshTokenTimestamp: number | null = null;
  private subscribers: Array<(token: string | null) => void> = [];

  // Singleton instance
  private static instance: SessionToken;
  public static getInstance(): SessionToken {
    if (!SessionToken.instance) {
      SessionToken.instance = new SessionToken();
    }
    return SessionToken.instance;
  }

  // Getter/Setter cho token
  get value(): string | null {
    return this._value;
  }

  get refreshToken(): string | null {
    return this._refreshToken;
  }

  get timestamp(): number | null {
    return this._timestamp;
  }

  get refreshTokenTimestamp(): number | null {
    return this._refreshTokenTimestamp;
  }

  set value(newToken: string | null) {
    if (typeof window === "undefined")
      throw new Error("Cannot set token on server side");

    this._value = newToken;
    this._timestamp = Date.now();
    this.notifySubscribers();
    // update localStorage to notify (sync) other tabs
    try {
      // TODO: for security, we should encrypt the token with asymmetric encryption
      localStorage.setItem(
        "token_sync",
        JSON.stringify({ token: newToken, ts: Date.now() }),
      );
    } catch (error) {
      console.error("Error updating token_sync:", error);
    }

    // auto clear after 3s
    setTimeout(() => {
      if (localStorage.getItem("token_sync")) {
        localStorage.removeItem("token_sync");
      }
    }, 3000);
  }

  set refreshToken(newToken: string | null) {
    if (typeof window === "undefined")
      throw new Error("Cannot set token on server side");

    this._refreshToken = newToken;
    this._refreshTokenTimestamp = Date.now();
    this.notifySubscribers();
    // update localStorage to notify (sync) other tabs
    try {
      // TODO: for security, we should encrypt the token with asymmetric encryption
      localStorage.setItem(
        "refresh_token_sync",
        JSON.stringify({ token: newToken, ts: Date.now() }),
      );
    } catch (error) {
      console.error("Error updating token_sync:", error);
    }

    // auto clear after 3s
    setTimeout(() => {
      if (localStorage.getItem("refresh_token_sync")) {
        localStorage.removeItem("refresh_token_sync");
      }
    }, 3000);
  }

  subscribe(callback: (token: string | null) => void) {
    this.subscribers.push(callback);
  }
  unsubscribe(callback: (token: string | null) => void) {
    this.subscribers = this.subscribers.filter((cb) => cb !== callback);
  }
  private notifySubscribers() {
    this.subscribers.forEach((cb) => cb(this._value));
  }
}

export const clientSessionToken = SessionToken.getInstance();

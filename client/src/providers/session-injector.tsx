"use client";

import { useEffect, useState } from "react";
import fetchRequest from "~/lib/fetch-base";

import { clientSessionToken } from "~/lib";

export function SessionInjector({
  children,
  initialSessionToken = {},
}: {
  children: React.ReactNode;
  initialSessionToken?: {
    accessToken?: string;
    refreshToken?: string;
  };
}) {
  // just hacky way to inject session token
  useState(() => {
    if (typeof window !== "undefined") {
      clientSessionToken.value = initialSessionToken.accessToken || null;
      clientSessionToken.refreshToken =
        initialSessionToken.refreshToken || null;

      fetchRequest.setAuthGetter((type: "AT" | "RT") => {
        return Promise.resolve(
          type === "AT"
            ? clientSessionToken.value
            : clientSessionToken.refreshToken,
        );
      });
    }
  });

  const parseStorageData = (
    key: string,
  ): { token: string; ts: number } | null => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || "null") as {
        token: string;
        ts: number;
      };
      if (
        data &&
        typeof data.token === "string" &&
        typeof data.ts === "number"
      ) {
        return data;
      }
    } catch (error) {
      console.error(`Error parsing ${key} data:`, error);
    }
    return null;
  };

  useEffect(() => {
    // reference -> https://kettanaito.com/blog/dont-sleep-on-abort-controller
    const controller = new AbortController();

    const syncHandler = (e: StorageEvent) => {
      if (e.key === "token_sync") {
        const data = parseStorageData(e.key);
        if (
          data &&
          data.token !== clientSessionToken.value &&
          (!clientSessionToken.timestamp ||
            data.ts > clientSessionToken.timestamp)
        ) {
          clientSessionToken.value = data.token;
        }
        localStorage.removeItem("token_sync"); // ✅ Cleanup after syncing
      }

      if (e.key === "refresh_token_sync") {
        const data = parseStorageData(e.key);
        if (
          data &&
          data.token !== clientSessionToken.refreshToken &&
          (!clientSessionToken.refreshTokenTimestamp ||
            data.ts > clientSessionToken.refreshTokenTimestamp)
        ) {
          clientSessionToken.refreshToken = data.token;
        }
        localStorage.removeItem("refresh_token_sync"); // ✅ Cleanup after syncing
      }
    };

    window.addEventListener("storage", syncHandler, {
      signal: controller.signal,
    });

    return () => {
      // Calling `.abort()` removes ALL event listeners
      // associated with `controller.signal`. Gone!
      controller.abort();
    };
  }, []);

  return <>{children}</>;
}

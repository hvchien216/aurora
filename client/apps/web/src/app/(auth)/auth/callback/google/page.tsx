"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderIcon } from "lucide-react";

import { clientSessionToken, httpRequest } from "~/lib";
import { tryCatch } from "@leww/utils";

const CallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");

      if (!accessToken || !refreshToken) {
        setError("Authentication failed");
        return;
      }

      const { error } = await tryCatch(
        httpRequest.post(`${process.env.NEXT_PUBLIC_HOST_URL}/api/auth`, {
          accessToken,
          refreshToken,
        }),
      );

      if (error) {
        setError("Authentication failed");
        return;
      }

      clientSessionToken.value = accessToken;

      // Redirect to dashboard or home page
      router.push("/w");
      router.refresh();
      // Refresh the router to update server components
    };

    if (searchParams.has("accessToken") || searchParams.has("refreshToken")) {
      (async () => {
        await handleCallback();
      })();
    } else if (searchParams.has("error")) {
      // Handle OAuth error from provider
      setError(`Authentication error: ${searchParams.get("error")}`);
    }
  }, [searchParams, router]);

  if (error) {
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center space-x-2">
        <LoaderIcon className="size-4 animate-spin text-gray-600" />
        <p className="text-xs text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default CallbackPage;

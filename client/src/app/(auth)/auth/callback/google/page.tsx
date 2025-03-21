"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {};

const CallbackPage = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract tokens from URL parameters
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");

        // Handle missing tokens
        if (!accessToken || !refreshToken) {
          throw new Error("Authentication failed: Missing tokens");
        }

        // // Validate token format (basic validation)
        // try {
        //   const userData = parseToken(accessToken);
        //   if (!userData || !userData.email) {
        //     throw new Error("Invalid token format");
        //   }
        // } catch (err) {
        //   throw new Error("Authentication failed: Invalid token format");
        // }

        // // Set cookies
        // setAuthCookies(accessToken, refreshToken);

        // Redirect to dashboard or home page
        // router.push("/dashboard");
        // router.refresh(); // Refresh the router to update server components
      } catch (err: unknown) {
        console.error("Authentication error:", err);
        setError("Authentication failed");
      }
    };

    if (searchParams.has("accessToken") || searchParams.has("refreshToken")) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-floating-promises
      (async () => {
        await handleCallback();
      })();
    } else if (searchParams.has("error")) {
      // Handle OAuth error from provider
      setError(`Authentication error: ${searchParams.get("error")}`);
    }
  }, [searchParams, router]);
  return <div>CallbackPage</div>;
};

export default CallbackPage;

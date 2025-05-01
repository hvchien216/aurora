import React from "react";
import Link from "next/link";
import { GradientBackground, Wordmark } from "@leww/ui";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <GradientBackground />
      <div className="relative flex min-h-screen w-full justify-center">
        <Link href="/" className="absolute left-4 top-3 z-10">
          <Wordmark />
        </Link>
        {children}
      </div>
    </>
  );
};

export default AuthLayout;

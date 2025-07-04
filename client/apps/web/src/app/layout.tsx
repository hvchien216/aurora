import type { Metadata } from "next";

import "~/styles/globals.css";
import "~/styles/themes.css";

import { cookies } from "next/headers";
import { SonnerToaster } from "@leww/ui";
import { SessionInjector } from "~/providers";
import { metadataConstructor } from "~/utils";

import { inter } from "~/styles/fonts";
import RootProviders from "~/app/providers";

export const metadata: Metadata = metadataConstructor();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const refreshToken = cookieStore.get("refreshToken");

  return (
    <html lang="en" className="mdl-js" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {/* keep SessionInjector outside to allow RootProviders caching. */}
        <SessionInjector
          key={`${refreshToken?.value}-${accessToken?.value}`}
          initialSessionToken={{
            accessToken: accessToken?.value,
            refreshToken: refreshToken?.value,
          }}
        >
          <RootProviders>{children}</RootProviders>
        </SessionInjector>
        <SonnerToaster />
      </body>
    </html>
  );
}

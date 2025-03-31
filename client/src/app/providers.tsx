import { type ReactNode } from "react";

import { Toaster } from "~/components/shared/toaster";

// TODO: use this for all providers in the app
export default function RootProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

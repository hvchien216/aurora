"use client";

import { QueryClientProvider as _QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "~/lib";

export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  return (
    <_QueryClientProvider client={queryClient}>{children}</_QueryClientProvider>
  );
}

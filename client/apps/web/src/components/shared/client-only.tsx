"use client";

import { useEffect, useState, type ReactNode } from "react";

export const ClientOnly = ({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) => {
  const [clientReady, setClientReady] = useState<boolean>(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  return clientReady ? <div>{children}</div> : fallback || null;
};

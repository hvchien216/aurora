// apps/web/src/providers/active-workspace-provider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { type Workspace } from "~/features/workspaces";

interface ActiveWorkspaceContextType {
  activeWorkspace: Workspace | null;
  setActiveWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>;
}

const ActiveWorkspaceContext = createContext<ActiveWorkspaceContextType | null>(
  null,
);

export const ActiveWorkspaceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    null,
  );

  return (
    <ActiveWorkspaceContext.Provider
      value={{ activeWorkspace, setActiveWorkspace }}
    >
      {children}
    </ActiveWorkspaceContext.Provider>
  );
};

export const useActiveWorkspace = () => {
  const context = useContext(ActiveWorkspaceContext);
  if (!context) {
    throw new Error(
      "useActiveWorkspace must be used within an ActiveWorkspaceProvider",
    );
  }
  return context;
};

"use client";

import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@leww/ui";
import { ChevronsUpDown, Plus } from "lucide-react";

export function WorkspaceSwitcher({
  activeWorkspace,
  workspaces,
  onWorkspaceChange,
}: {
  activeWorkspace?: {
    name: string;
    slug: string;
    logo: string;
    plan: string;
  };
  workspaces: {
    name: string;
    slug: string;
    logo: string;
    plan: string;
  }[];
  onWorkspaceChange: (slug: string) => void;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Avatar className="size-4 rounded-md">
                  <AvatarImage
                    src={activeWorkspace?.logo}
                    alt={activeWorkspace?.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {activeWorkspace?.name
                      ? activeWorkspace.name
                          .trim()
                          .split(" ")
                          .slice(0, 3)
                          .map((word) => word[0])
                          .join("")
                      : ""}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeWorkspace?.name}
                </span>
                <span className="truncate text-xs">
                  {activeWorkspace?.plan}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((workspace, index) => (
              <DropdownMenuItem
                key={workspace.name}
                onClick={() => onWorkspaceChange(workspace.slug)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Avatar className="size-4 rounded-md">
                    <AvatarImage src={workspace?.logo} alt={workspace?.name} />
                    <AvatarFallback className="rounded-lg">
                      {workspace?.name
                        ? workspace.name
                            .trim()
                            .split(" ")
                            .slice(0, 3)
                            .map((word) => word[0])
                            .join("")
                        : ""}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {workspace.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

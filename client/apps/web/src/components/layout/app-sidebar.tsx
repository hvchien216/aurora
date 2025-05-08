"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@leww/ui";
import { useActiveWorkspace } from "~/providers";

import { useWorkspaceSlug } from "~/hooks";
import { locations } from "~/constants";
import { useGetUserProfileQuery } from "~/features/user/hooks";
import { useGeWorkSpacesQuery } from "~/features/workspaces/hooks";

import { SIDEBAR_DATA } from "./constants";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { WorkspaceSwitcher } from "./workspace-switcher";

const getWorkspaceNavData = (workspaceSlug: string) => {
  return SIDEBAR_DATA.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      url: `${locations.links(workspaceSlug)}${item.href}`,
    })),
  }));
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  // TODO: fix hit api profile twice
  const { data: user } = useGetUserProfileQuery();
  const { data: workspacesData } = useGeWorkSpacesQuery();

  const currentWorkspaceSlug = useWorkspaceSlug();
  const { setActiveWorkspace } = useActiveWorkspace();

  useEffect(() => {
    if (workspacesData) {
      setActiveWorkspace(
        (workspacesData || []).find(
          (workspace) => workspace.slug === currentWorkspaceSlug,
        ) || null,
      );
    }
  }, [workspacesData, currentWorkspaceSlug, setActiveWorkspace]);

  const handleChangeWorkspace = (slug: string) => {
    setActiveWorkspace(
      (workspacesData || []).find((workspace) => workspace.slug === slug) ||
        null,
    );
    router.push(locations.links(slug));
  };

  const workspaces = (workspacesData || [])?.map((workspace) => ({
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    logo: `https://api.dicebear.com/9.x/shapes/svg?seed=${workspace.id}`, // TODO: get plan from api
    plan: "Free", // TODO: get plan from api
  }));

  const activeWorkspace = workspaces.find(
    (workspace) => workspace.slug === currentWorkspaceSlug,
  );

  const workspaceNavData = getWorkspaceNavData(currentWorkspaceSlug || "");

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher
          activeWorkspace={activeWorkspace}
          workspaces={workspaces}
          onWorkspaceChange={handleChangeWorkspace}
        />
      </SidebarHeader>
      <SidebarContent>
        {workspaceNavData.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            email: user?.email || "",
            name: [user?.firstName || "", user?.lastName || ""].join(" "),
            avatar: `https://api.dicebear.com/9.x/shapes/svg?seed=${user?.id}`,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@leww/ui";

import { useGetUserProfileQuery } from "~/features/user/hooks";

import { SIDEBAR_DATA } from "./constants";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { WorkspaceSwitcher } from "./workspace-switcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // TODO: fix hit api profile twice
  const { data: user } = useGetUserProfileQuery();
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={SIDEBAR_DATA.workspaces} />
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_DATA.navGroups.map((props) => (
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

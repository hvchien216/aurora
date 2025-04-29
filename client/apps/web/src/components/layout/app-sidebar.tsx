"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/shared";

import { SIDEBAR_DATA } from "./constants";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { WorkspaceSwitcher } from "./workspace-switcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavUser user={SIDEBAR_DATA.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

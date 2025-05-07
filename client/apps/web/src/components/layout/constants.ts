import type { ElementType } from "react";
import { BarChart, LayoutDashboard } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: ElementType;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const SIDEBAR_DATA: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "", // Base path without workspace
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        href: "/analytics", // Base path without workspace
        icon: BarChart,
      },
    ],
  },
  // ... other nav groups
];

import {
  AudioWaveform,
  GalleryVerticalEnd,
  LayoutDashboardIcon,
} from "lucide-react";

import { type SidebarData } from "./types";

export const SIDEBAR_DATA: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "https://api.dicebear.com/9.x/micah/svg",
  },
  workspaces: [
    {
      name: "Lewis",
      logo: GalleryVerticalEnd,
      plan: "Pro",
    },
    {
      name: "Jisoo",
      logo: AudioWaveform,
      plan: "Free",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          // TODO: fix this url, should be a fn take in slug as dynamic param
          url: "/w/ho-van-chien",
          icon: LayoutDashboardIcon,
        },
      ],
    },
  ],
};

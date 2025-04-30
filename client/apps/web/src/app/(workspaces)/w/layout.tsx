import { cookies } from "next/headers";
import { cn } from "@leww/utils";

import { AppHeader, AppSidebar } from "~/components/layout";
import { GradientBackground, SidebarProvider } from "~/components/shared";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <>
      <GradientBackground />
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <div
          id="content"
          className={cn(
            "relative ml-auto min-h-screen w-full max-w-full",
            "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
            "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
            "transition-[width] duration-200 ease-linear",
            "flex h-svh flex-col",
            "group-data-[scroll-locked=1]/body:h-full",
            "group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh",
          )}
        >
          <AppHeader />
          {children}
        </div>
      </SidebarProvider>
    </>
  );
}

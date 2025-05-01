import { SidebarTrigger, ThemeCustomizer, ThemeToggle } from "@leww/ui";

export function AppHeader() {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 gap-2transition-[width,height] flex h-12 shrink-0 items-center justify-between ease-linear">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
      </div>

      <div className="flex items-center gap-2 px-4">
        {/* <NavUser user={SIDEBAR_DATA.user} /> */}
        <ThemeToggle />
        <ThemeCustomizer />
        {/* <ThemeSelector /> */}
      </div>
    </header>
  );
}

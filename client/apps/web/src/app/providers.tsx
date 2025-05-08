import { type ReactNode } from "react";
import { Toaster, TooltipProvider } from "@leww/ui";
import {
  ActiveWorkspaceProvider,
  QueryClientProvider,
  ThemeProvider,
} from "~/providers";

import { THEMES } from "@leww/utils";

// TODO: use this for all providers in the app
export default function RootProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <QueryClientProvider>
        <ThemeProvider
          themes={THEMES}
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <TooltipProvider disableHoverableContent>
            <ActiveWorkspaceProvider>
              {/* <ActiveThemeProvider initialTheme={activeThemeValue}> */}
              {children}
              {/* </ActiveThemeProvider> */}
            </ActiveWorkspaceProvider>
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

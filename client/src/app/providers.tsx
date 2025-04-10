import { type ReactNode } from "react";
import { QueryClientProvider, ThemeProvider } from "~/providers";

import { Toaster } from "~/components/shared/sonner";
import { TooltipProvider } from "~/components/shared";
import { THEMES } from "~/constants";

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
            {/* <ActiveThemeProvider initialTheme={activeThemeValue}> */}
            {children}
            {/* </ActiveThemeProvider> */}
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

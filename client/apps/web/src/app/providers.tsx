import { type ReactNode } from "react";
import { Toaster, TooltipProvider } from "@leww/ui";
import { THEMES } from "@leww/utils";
import { QueryClientProvider, ThemeProvider } from "~/providers";

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

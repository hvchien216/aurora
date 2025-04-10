"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/shared";

export function ThemeToggle() {
  const { theme, themes, resolvedTheme, setTheme } = useTheme();

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = theme === "dark" ? "#020817" : "#fff";
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute("content", themeColor);
  }, [theme]);

  const currentTheme = theme ?? resolvedTheme ?? "light";
  const isDark = currentTheme.startsWith("dark");
  const baseTheme = isDark ? currentTheme.replace("dark-", "") : currentTheme;

  // Determine the next theme
  const toggleTheme = () => {
    let nextTheme = "";

    if (currentTheme === "dark") {
      nextTheme = "light"; // If it's "dark", toggle to "light"
    } else if (currentTheme === "light") {
      nextTheme = "dark"; // If it's "light", toggle to "dark"
    } else if (isDark) {
      nextTheme = themes.includes(baseTheme) ? baseTheme : "light"; // Switch to light version
    } else {
      nextTheme = themes.includes(`dark-${baseTheme}`)
        ? `dark-${baseTheme}`
        : "dark"; // Switch to dark variant
    }

    setTheme(nextTheme);
  };

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            className="mr-2 h-8 w-8 rounded-full bg-background"
            variant="outline"
            size="icon"
            onClick={toggleTheme}
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform duration-500 ease-in-out dark:rotate-0 dark:scale-100" />
            <MoonIcon className="scale-1000 absolute h-[1.2rem] w-[1.2rem] rotate-0 transition-transform duration-500 ease-in-out dark:-rotate-90 dark:scale-0" />
            <span className="sr-only">Switch Theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Switch Theme</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

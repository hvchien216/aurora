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
  const { theme, themes, setTheme } = useTheme();

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = theme === "dark" ? "#020817" : "#fff";
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute("content", themeColor);
  }, [theme]);

  const currentTheme = theme ?? "light";
  const isDark = currentTheme.startsWith("dark");
  const baseTheme = isDark ? currentTheme.replace("dark-", "") : currentTheme;

  // Determine the next theme
  const toggleTheme = () => {
    const nextTheme = isDark
      ? themes.includes(baseTheme)
        ? baseTheme // Switch to light version
        : "light"
      : themes.includes(`dark-${baseTheme}`)
        ? `dark-${baseTheme}` // Switch to dark variant
        : "dark";

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

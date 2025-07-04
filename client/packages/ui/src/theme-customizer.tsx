"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { CheckIcon, PaletteIcon, RepeatIcon } from "lucide-react";
import { baseColors, cn } from "@leww/utils";

import { Button } from "./button";
import { DialogTitle } from "./dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Skeleton } from "./skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export function ThemeCustomizer() {
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full bg-background md:hidden"
            size="icon"
          >
            <PaletteIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <DialogTitle className="sr-only">Theme Customizer</DialogTitle>
          <Customizer />
        </DrawerContent>
      </Drawer>
      <div className="hidden items-center md:flex">
        <Popover>
          <Tooltip delayDuration={100}>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-background"
                  size="icon"
                >
                  <PaletteIcon />
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent side="bottom">Theme Customizer</TooltipContent>
          </Tooltip>

          <PopoverContent
            align="end"
            className="z-[999] w-[340px] rounded-[12px] p-6"
            sideOffset={10}
          >
            <Customizer />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

export function Customizer() {
  const [mounted, setMounted] = React.useState(false);
  const { setTheme, resolvedTheme: theme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-start pt-4 md:pt-0">
        <div className="space-y-1 pr-2">
          <div className="font-semibold leading-none tracking-tight">
            Customize
          </div>
          <div className="text-xs text-muted-foreground">
            Pick a style and color for the website.
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto rounded-[0.5rem]"
          onClick={() => setTheme("system")}
        >
          <RepeatIcon />
          <span className="sr-only">Reset</span>
        </Button>
      </div>
      <div className="flex flex-1 flex-col space-y-4 md:space-y-6">
        <div className="space-y-1.5">
          <Label className="text-xs">Color</Label>
          <div className="grid grid-cols-3 gap-2">
            {baseColors.map((color) => {
              const isActive = theme?.includes(color.name);

              return mounted ? (
                <Button
                  variant={"outline"}
                  size="sm"
                  key={color.name}
                  onClick={() => {
                    setTheme(
                      theme?.includes("dark")
                        ? `dark-${color.name}`
                        : color.name,
                    );
                  }}
                  className={cn(
                    "justify-start",
                    isActive && "border-2 border-primary",
                  )}
                  style={
                    {
                      "--theme-primary": `hsl(${
                        color?.activeColor[theme === "dark" ? "dark" : "light"]
                      })`,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className={cn(
                      "mr-1 flex size-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]",
                    )}
                  >
                    {isActive && <CheckIcon className="size-4 text-white" />}
                  </span>
                  {color.label}
                </Button>
              ) : (
                <Skeleton className="h-8 w-full" key={color.name} />
              );
            })}
          </div>
        </div>
        {/* <div className="space-y-1.5">
          <Label className="text-xs">Mode</Label>
          <div className="grid grid-cols-3 gap-2">
            {mounted ? (
              <>
                <Button
                  variant={"outline"}
                  size="sm"
                  onClick={() =>
                    setTheme(
                      theme === "dark"
                        ? "light"
                        : theme?.includes("dark")
                          ? theme?.replace("dark-", "")
                          : `${theme}`,
                    )
                  }
                  className={cn(
                    !theme?.includes("dark") && "border-2 border-primary",
                  )}
                >
                  <SunIcon className="mr-1 -translate-x-1" />
                  Light
                </Button>
                <Button
                  variant={"outline"}
                  size="sm"
                  onClick={() =>
                    setTheme(
                      theme === "light"
                        ? "dark"
                        : theme?.includes("dark")
                          ? theme
                          : `dark-${theme}`,
                    )
                  }
                  className={cn(
                    theme?.includes("dark") && "border-2 border-primary",
                  )}
                >
                  <MoonIcon className="mr-1 -translate-x-1" />
                  Dark
                </Button>
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}

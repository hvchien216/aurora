"use client";

import * as React from "react";
import _TextareaAutosize, {
  type TextareaAutosizeProps as _TextareaAutosizeProps,
} from "react-textarea-autosize";

import { cn } from "~/lib";

export type TextareaAutosizeProps = _TextareaAutosizeProps;

const TextareaAutosize = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & TextareaAutosizeProps
>(({ className, ...props }, ref) => {
  return (
    <_TextareaAutosize
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
TextareaAutosize.displayName = "TextareaAutosize";

export { TextareaAutosize };

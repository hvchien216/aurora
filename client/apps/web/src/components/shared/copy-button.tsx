"use client";

import { cn } from "@leww/utils";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";
import { cva, type VariantProps } from "class-variance-authority";
import { toast } from "sonner";
import { Check, Copy, type LucideIcon } from "lucide-react";

const copyButtonVariants = cva(
  "group relative rounded-full p-1.5 transition-all duration-75",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-neutral-100 active:bg-neutral-200",
        neutral: "bg-transparent hover:bg-neutral-100 active:bg-neutral-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function CopyButton({
  variant = "default",
  value,
  className,
  icon,
  successMessage,
}: {
  value: string;
  className?: string;
  icon?: LucideIcon;
  successMessage?: string;
} & VariantProps<typeof copyButtonVariants>) {
  const [copied, copyToClipboard] = useCopyToClipboard();
  const Comp = icon || Copy;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toast.promise(copyToClipboard(value), {
          success: successMessage || "Copied to clipboard!",
        });
      }}
      className={cn(copyButtonVariants({ variant }), className)}
      type="button"
    >
      <span className="sr-only">Copy</span>
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Comp className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

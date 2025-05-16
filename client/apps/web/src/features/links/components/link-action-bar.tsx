import { type PropsWithChildren } from "react";
import { Button, useFormContext, useFormState } from "@leww/ui";

import { cn } from "@leww/utils";
import { type CreateLinkForm } from "~/features/links/schemas";

export function LinkActionBar({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  const { control, reset } = useFormContext<CreateLinkForm>();
  const { isDirty, isValid, isSubmitting } = useFormState({
    control,
  });
  const showActionBar = isDirty || isSubmitting;

  return (
    <div
      className={cn(
        "sticky bottom-0 w-full overflow-hidden lg:bottom-4 lg:[filter:drop-shadow(0_5px_8px_#222A351d)]",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-3xl items-center justify-between gap-4 overflow-hidden px-4 py-3",
          "border-t border-neutral-200 bg-white lg:rounded-xl lg:border",
          "lg:transition-[opacity,transform]",
          !showActionBar && "lg:translate-y-4 lg:scale-90 lg:opacity-0",
        )}
      >
        {children || (
          <span
            className="text-sm font-medium text-neutral-600 lg:block"
            aria-hidden={!isDirty}
          >
            Unsaved changes
          </span>
        )}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            // className="hidden lg:flex"
            onClick={() => reset()}
          >
            Discard
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={!isDirty || !isValid}
            loading={isSubmitting}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}

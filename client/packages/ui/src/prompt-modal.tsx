"use client";

import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { GlobeIcon } from "lucide-react";

import { Button, type ButtonProps } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { useIsMobile } from "./hooks";
import { Input, type InputProps } from "./input";

type PromptModelProps = {
  title: string;
  label: string;
  description?: string;
  onSubmit?: (value: string) => Promise<void> | void;
  inputProps?: InputProps;
  buttonProps?: ButtonProps;
};

/**
 * A generic prompt modal for text input
 */
function PromptModal({
  showPromptModal,
  setShowPromptModal,
  title,
  label,
  description,
  onSubmit,
  inputProps,
  buttonProps,
}: {
  showPromptModal: boolean;
  setShowPromptModal: Dispatch<SetStateAction<boolean>>;
} & PromptModelProps) {
  const isMobile = useIsMobile();

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={showPromptModal} onOpenChange={setShowPromptModal}>
      <DialogContent className="flex max-w-screen-lg flex-col gap-0 p-0 sm:max-w-screen-xs [&>button:last-child]:top-3.5">
        {/* <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="flex items-center gap-1 px-5 py-3 text-base">
              <LinkIcon className="size-4" /> Link Preview
            </DialogTitle>
          </DialogHeader> */}
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col items-center justify-center space-y-3 border-b border-neutral-200 p-4 pt-8 text-center sm:px-16">
              <GlobeIcon className="mx-auto size-12 text-neutral-400" />
              <h3 className="text-lg font-medium">{title}</h3>
              {description && (
                <p className="text-sm text-neutral-500">{description}</p>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();

            setLoading(true);
            await onSubmit?.(value);
            setLoading(false);
            setShowPromptModal(false);
          }}
          className="flex flex-col space-y-3 bg-neutral-50 px-4 py-8 text-left sm:px-16"
        >
          <label className="block">
            <p className="text-sm text-neutral-700">{label}</p>
            <div className="relative mt-1 rounded-md shadow-sm">
              <Input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                autoFocus={!isMobile}
                autoComplete="off"
                {...inputProps}
              />
            </div>
          </label>

          <Button loading={loading} disabled={!value?.length} {...buttonProps}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function usePromptModal(props: PromptModelProps) {
  const [showPromptModal, setShowPromptModal] = useState(false);

  const PromptModalCallback = useCallback(() => {
    return props ? (
      <PromptModal
        showPromptModal={showPromptModal}
        setShowPromptModal={setShowPromptModal}
        {...props}
      />
    ) : null;
  }, [showPromptModal, setShowPromptModal]);

  return useMemo(
    () => ({
      setShowPromptModal,
      PromptModal: PromptModalCallback,
    }),
    [setShowPromptModal, PromptModalCallback],
  );
}

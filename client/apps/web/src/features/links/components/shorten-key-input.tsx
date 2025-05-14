import { useEffect, useState } from "react";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useConfirm,
  useDebounceValue,
  useFormContext,
} from "@leww/ui";
import { Lock, RefreshCw, Unlock } from "lucide-react";

import { RHFInput } from "~/components/rhf";
import { cn, isNil } from "@leww/utils";
import {
  useCheckKeyAvailabilityQuery,
  useGenerateKeyLazyQuery,
} from "~/features/links/hooks";
import { type CreateLinkForm } from "~/features/links/schemas";

interface ShortenKeyInputProps {
  enableLock?: boolean;
}

export const ShortenKeyInput: React.FC<ShortenKeyInputProps> = ({
  enableLock = false,
}) => {
  // TODO: change CreateLinkForm to LinkForm for reusable in both creating & updating cases
  const { watch, setValue, setError, clearErrors } =
    useFormContext<CreateLinkForm>();
  const [url, key, workspaceId] = watch(["url", "key", "workspaceId"]);
  const debouncedUrl = useDebounceValue(url, 450);
  const debouncedKey = useDebounceValue(key, 450);
  const [ConfirmationDialog, confirm] = useConfirm(
    "Unlock Key",
    "Are you sure you want to unlock this key? Editing an existing short link could potentially break existing links.",
    {
      variant: "default",
      label: "Unlock",
    },
  );

  const [isFocused, setIsFocused] = useState(false);
  const [isLocked, setIsLocked] = useState(enableLock);

  const {
    mutateAsync: generateKey,
    data: generateKeyData,
    reset: resetGenerateKey,
    isPending: isGeneratingKey,
  } = useGenerateKeyLazyQuery({
    onSuccess: (data) => {
      if (data?.key) {
        clearErrors("key");
        setValue("key", data.key, { shouldDirty: true });
      }
    },
  });

  // Check if the key is available
  const { data: keyAvailabilityData } = useCheckKeyAvailabilityQuery(
    {
      key: debouncedKey,
      workspaceId: workspaceId || "",
    },
    {
      enabled:
        !!debouncedKey &&
        debouncedKey.length > 0 &&
        !isNil(workspaceId) &&
        generateKeyData?.key !== debouncedKey &&
        isFocused,
    },
  );

  useEffect(() => {
    if (debouncedUrl && !debouncedKey?.length) {
      (async () => {
        await generateKey();
      })();
    }
  }, [debouncedUrl]);

  useEffect(() => {
    if (
      keyAvailabilityData?.hasOwnProperty("isAvailable") &&
      !keyAvailabilityData?.isAvailable
    ) {
      setError("key", { message: "✗ Key is not available" });
    }
  }, [keyAvailabilityData]);

  const handleGenerateKey = async () => {
    await generateKey();
  };

  const handleLockKey = async () => {
    const confirmed = await confirm();
    if (confirmed) {
      setIsLocked(false);
    }
  };

  return (
    <div className="space-y-2">
      <ConfirmationDialog />
      <RHFInput
        name="key"
        label="Shorten Key"
        disabled={isLocked}
        classNames={{
          input: isLocked ? "bg-gray-200" : "",
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        right={
          <>
            {!isLocked && (
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-min cursor-pointer p-0.5"
                    onClick={handleGenerateKey}
                    disabled={isGeneratingKey}
                  >
                    <RefreshCw
                      className={cn(
                        "size-4",
                        isGeneratingKey ? "animate-spin" : "",
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Generate a random key
                </TooltipContent>
              </Tooltip>
            )}
            {isLocked && (
              <Button
                type="button"
                variant="ghost"
                className="h-min cursor-pointer p-0"
                onClick={handleLockKey}
              >
                {isLocked ? (
                  <Unlock className="size-4" />
                ) : (
                  <Lock className="size-4" />
                )}
              </Button>
            )}
          </>
        }
      />
    </div>
  );
};

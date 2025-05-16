"use client";

import React from "react";
import {
  Button,
  ShimmerDots,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useDebounceValue,
  useFormContext,
  useIsMobile,
} from "@leww/ui";
import { PenIcon, QrCodeIcon } from "lucide-react";

import { QRCode } from "~/components/shared";
import { type CreateLinkForm } from "~/features/links/schemas";

import CustomizeQRCodePreviewFormModal from "./customize-qr-code-preview-modal";

export const QRCodePreview = () => {
  const [open, setOpen] = React.useState(false);

  const isMobile = useIsMobile();
  const { watch } = useFormContext<CreateLinkForm>();

  // TODO: replace by key (key for destination link)
  const [url] = watch(["url"]);
  const debouncedUrl = useDebounceValue(url, 450);

  return (
    <>
      <CustomizeQRCodePreviewFormModal open={open} setOpen={setOpen} />
      <h2 className="mb-3 text-sm font-medium text-foreground">QR Code</h2>
      <div className="relative aspect-[1200/450] w-full rounded-md border border-neutral-300 bg-white">
        {!isMobile && (
          <ShimmerDots className="pointer-events-none opacity-30 [mask-image:radial-gradient(40%_80%,transparent_50%,black)]" />
        )}
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute right-2 top-2 z-10 h-8 w-fit px-1.5"
              onClick={() => setOpen(true)}
              disabled={debouncedUrl?.length === 0}
            >
              <PenIcon className="mx-px size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Open QR Code Preview</TooltipContent>
        </Tooltip>
        {debouncedUrl?.length > 0 ? (
          <div className="relative flex size-full flex-col items-center justify-center">
            <QRCode url={debouncedUrl} scale={0.5} />
          </div>
        ) : (
          <div className="pointer-events-none relative flex size-full flex-col items-center justify-center gap-2">
            <QrCodeIcon className="size-5 text-neutral-700" />
            <p className="max-w-32 text-center text-xs text-neutral-700">
              Enter a link to generate a QR code
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default QRCodePreview;

import React, { useRef } from "react";
import {
  Button,
  DialogFooter,
  ShimmerDots,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useIsMobile,
} from "@leww/ui";
import { useFormContext } from "react-hook-form";
import { DownloadCloud } from "lucide-react";

import { QRCode, type QRCodeRef } from "~/components/shared";
import { getQRAsCanvas } from "~/lib";
import { download } from "@leww/utils";
import { type CreateLinkForm } from "~/features/links/schemas";

type Props = {
  handleClose: () => void;
};

const CustomizeQRCodePreviewForm: React.FC<Props> = ({ handleClose }) => {
  const { getValues: getValuesParent } = useFormContext<CreateLinkForm>();

  const isMobile = useIsMobile();
  const url = getValuesParent("url");

  const qrRef = useRef<QRCodeRef>(null);

  const onSVGButtonClick = async () => {
    if (qrRef.current == null) {
      return;
    }

    download(
      (await getQRAsCanvas(qrRef.current.qrData, "image/png")) as string,
      "qrcode.png",
    );
  };

  return (
    <>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">QR Code</p>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-fit rounded-full p-0"
                onClick={onSVGButtonClick}
              >
                <DownloadCloud className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Download QR Code</TooltipContent>
          </Tooltip>
        </div>
        <div className="relative aspect-[1200/450] w-full rounded-md border border-neutral-300 bg-white">
          {!isMobile && (
            <ShimmerDots className="pointer-events-none opacity-30 [mask-image:radial-gradient(40%_80%,transparent_50%,black)]" />
          )}
          {url?.length > 0 && (
            <div className="relative flex size-full flex-col items-center justify-center">
              <QRCode ref={qrRef} url={url} />
            </div>
          )}
        </div>
      </div>
      <DialogFooter className="bg-neutral-50 px-4 py-3 sm:items-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          // disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          // disabled={!isDirty || !isValid}
          // loading={isSubmitting}
        >
          Save changes
        </Button>
      </DialogFooter>
      {/* </form>
      </Form> */}
    </>
  );
};

export default CustomizeQRCodePreviewForm;

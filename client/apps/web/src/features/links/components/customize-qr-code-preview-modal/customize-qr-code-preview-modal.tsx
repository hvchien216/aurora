import React, { type Dispatch, type SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@leww/ui";
import { QrCodeIcon } from "lucide-react";

import CustomizeQRCodePreviewForm from "./customize-qr-code-preview-form";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const CustomizeQRCodePreviewFormModal = ({ open, setOpen }: Props) => {
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="flex max-w-screen-lg flex-col gap-0 p-0 sm:max-w-screen-xs [&>button:last-child]:top-3.5"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
          }}
        >
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="flex items-center gap-1 px-5 py-3 text-base">
              <QrCodeIcon className="size-4" /> QR Code Preview
            </DialogTitle>
          </DialogHeader>
          <CustomizeQRCodePreviewForm handleClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomizeQRCodePreviewFormModal;

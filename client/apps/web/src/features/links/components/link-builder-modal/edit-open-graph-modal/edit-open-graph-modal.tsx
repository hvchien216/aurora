import React, { type Dispatch, type SetStateAction } from "react";
import { LinkIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/shared";
import EditOGForm from "~/features/links/components/link-builder-modal/edit-open-graph-modal/edit-og-form";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const EditOpenGraphModal = ({ open, setOpen }: Props) => {
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
              <LinkIcon className="size-4" /> Link Preview
            </DialogTitle>
          </DialogHeader>
          <EditOGForm handleClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditOpenGraphModal;

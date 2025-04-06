import { useState } from "react";
import { EarthIcon } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/shared";

import LinkBuilderForm from "./link-builder-form";

const LinkBuilderModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
        // className="rounded-2xl border-2 border-dashed border-black bg-white px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:text-white hover:shadow-[4px_4px_0px_black] active:translate-x-0 active:translate-y-0 active:rounded-2xl active:shadow-none"
        >
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex max-w-screen-lg flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-screen-lg [&>button:last-child]:top-3.5"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="flex items-center gap-1 px-5 py-3 text-base">
            <EarthIcon className="size-4" /> New link
          </DialogTitle>
        </DialogHeader>
        <LinkBuilderForm handleClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default LinkBuilderModal;

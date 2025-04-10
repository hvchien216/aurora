"use client";

import LinkBuilderModal from "./link-builder-modal";
import LinksList from "./links-list";

export default function WorkspaceLinks() {
  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex justify-end">
        <LinkBuilderModal />
      </div>
      <LinksList />
    </div>
  );
}

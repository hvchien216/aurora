"use client";

import LinkBuilderModal from "./link-builder-modal";

export default function WorkspaceLinks() {
  return (
    <div className="w-full p-4">
      <div className="flex justify-end">
        <LinkBuilderModal />
      </div>
    </div>
  );
}

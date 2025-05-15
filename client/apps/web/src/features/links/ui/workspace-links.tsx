"use client";

import LinkBuilderModal from "../components/link-builder-modal";
import LinksList from "../components/links-list";

export function WorkspaceLinks() {
  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex justify-end">
        <LinkBuilderModal />
      </div>
      <LinksList />
    </div>
  );
}

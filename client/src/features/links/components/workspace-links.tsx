"use client";

import { useState } from "react";

import LinkBuilderModal from "./link-builder-modal";

export default function WorkspaceLinks() {
  const [openLinkBuilder, setOpenLinkBuilder] = useState(false);
  return (
    <div className="w-full bg-yellow-500 p-4">
      <div className="flex justify-end">
        <LinkBuilderModal />
      </div>
    </div>
  );
}

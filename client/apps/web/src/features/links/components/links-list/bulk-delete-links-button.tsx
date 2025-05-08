"use client";

import React from "react";
import { DataTableActionBarAction, toast, useConfirm } from "@leww/ui";
import type { Table } from "@tanstack/react-table";
import { Trash } from "lucide-react";

import {
  useBulkDeleteLinksMutation,
  useInvalidateLinksWorkspace,
} from "~/features/links/hooks";
import { type Link } from "~/features/links/schemas";

interface BulkDeleteLinksButtonProps {
  selectedIds: string[];
  workspaceId: string;
  table: Table<Link>;
}

export const BulkDeleteLinksButton: React.FC<BulkDeleteLinksButtonProps> = ({
  selectedIds,
  workspaceId,
  table,
}) => {
  const invalidateLinksWorkspace = useInvalidateLinksWorkspace();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure you want to delete these links?",
    "This action cannot be undone.",
    {
      variant: "destructive",
      label: "Delete",
    },
  );

  const { mutateAsync, isPending } = useBulkDeleteLinksMutation({
    onSuccess: () => {
      invalidateLinksWorkspace();
      table.toggleAllRowsSelected(false);
    },
  });

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    const mutationPromise = mutateAsync({ ids: selectedIds, workspaceId });
    toast.promise(mutationPromise, {
      loading: "Deleting...",
      success: "Deleted links successfully",
      error: (err) => {
        return err.message;
      },
    });

    await mutationPromise;
  };

  return (
    <>
      <ConfirmationDialog />
      <DataTableActionBarAction
        size="icon"
        tooltip="Delete"
        isPending={isPending}
        onClick={onDelete}
      >
        <Trash />
      </DataTableActionBarAction>
    </>
  );
};

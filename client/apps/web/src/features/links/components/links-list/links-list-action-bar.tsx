"use client";

import { DataTableActionBar, DataTableActionBarSelection } from "@leww/ui";
import type { Table } from "@tanstack/react-table";
import { useActiveWorkspace } from "~/providers";

import { type Link } from "~/features/links/schemas";

import { BulkDeleteLinksButton } from "./bulk-delete-links-button";

interface TasksTableActionBarProps {
  table: Table<Link>;
}

export function LinksListActionBar({ table }: TasksTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const { activeWorkspace } = useActiveWorkspace();
  const selectedIds = rows.map((row) => row.id);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      {/* <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      /> */}
      <div className="flex items-center gap-1.5">
        {/* <DataTableActionBarAction
          size="icon"
          tooltip="Export"
          isPending={getIsActionPending("export")}
          onClick={onTaskExport}
        >
          <Download />
        </DataTableActionBarAction>
        */}
        <BulkDeleteLinksButton
          workspaceId={activeWorkspace?.id as string}
          selectedIds={selectedIds}
          table={table}
        />
      </div>
    </DataTableActionBar>
  );
}

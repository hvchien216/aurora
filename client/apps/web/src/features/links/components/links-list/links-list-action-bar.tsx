"use client";

import { DataTableActionBar, DataTableActionBarSelection } from "@leww/ui";
import type { Table } from "@tanstack/react-table";

import { type Link } from "~/features/links/schemas";

interface TasksTableActionBarProps {
  table: Table<Link>;
}

export function LinksListActionBar({ table }: TasksTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;

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
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete"
          isPending={getIsActionPending("delete")}
          onClick={onTaskDelete}
        >
          <Trash2 />
        </DataTableActionBarAction> */}
      </div>
    </DataTableActionBar>
  );
}

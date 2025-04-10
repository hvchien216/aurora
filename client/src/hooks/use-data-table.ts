"use client";

import React, { useMemo } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
} from "@tanstack/react-table";

import { type ExtendedColumnSort } from "~/types";

interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | "state"
      | "pageCount"
      | "getCoreRowModel"
      | "manualFiltering"
      | "manualPagination"
      | "manualSorting"
    >,
    Required<Pick<TableOptions<TData>, "pageCount">> {
  initialState?: Omit<Partial<TableState>, "sorting"> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  startTransition?: React.TransitionStartFunction;
  // Optional props for custom change handlers
  onChangePagination?: (pagination: PaginationState) => void;
  onChangeSorting?: (sorting: SortingState) => void;
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    initialState,
    onChangePagination,
    onChangeSorting,
    ...tableProps
  } = props;

  // Local state for pagination.
  const [page, setPage] = React.useState<number>(
    (initialState?.pagination?.pageIndex ?? 0) + 1,
  );
  const [perPage, setPerPage] = React.useState<number>(
    initialState?.pagination?.pageSize ?? 10,
  );

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1, // convert from one-based to zero-based index
      pageSize: perPage,
    };
  }, [page, perPage]);

  // Handler for pagination changes: update local state and/or notify parent.
  const handleChangePagination = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      let newPagination: PaginationState;
      if (typeof updaterOrValue === "function") {
        newPagination = updaterOrValue(pagination);
      } else {
        newPagination = updaterOrValue;
      }

      // Update local state.
      setPage(newPagination.pageIndex + 1);
      setPerPage(newPagination.pageSize);

      // Call custom logic if provided.
      if (onChangePagination) {
        onChangePagination(newPagination);
      }
    },
    [pagination, onChangePagination],
  );

  // Local state for sorting.
  const [sorting, setSorting] = React.useState<ExtendedColumnSort<TData>[]>(
    initialState?.sorting ?? [],
  );

  // Handler for sorting changes: update local state and/or notify parent.
  const handleChangeSorting = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      let newSorting: SortingState;
      if (typeof updaterOrValue === "function") {
        newSorting = updaterOrValue(sorting);
      } else {
        newSorting = updaterOrValue;
      }

      // Update local state.
      setSorting(newSorting as ExtendedColumnSort<TData>[]);

      // Call custom logic if provided.
      if (onChangeSorting) {
        onChangeSorting(newSorting);
      }
    },
    [sorting, onChangeSorting],
  );

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  // Preserve column IDs for sorting parsing.
  // const columnIds = React.useMemo(() => {
  //   return new Set(
  //     columns.map((column) => column.id).filter(Boolean) as string[],
  //   );
  // }, [columns]);

  // // Optionally parse the initial sorting state using your parsing utility.
  // React.useEffect(() => {
  //   setSorting(
  //     getSortingStateParser<TData>(columnIds).parse(
  //       initialState?.sorting ?? [],
  //     ),
  //   );
  // }, [columnIds, initialState?.sorting]);

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: handleChangePagination,
    onSortingChange: handleChangeSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  // return {
  //   table,
  //   rowSelection,
  //   columnVisibility,
  //   pagination,
  //   sorting,
  // };

  const _table = useMemo(
    () => ({
      table,
    }),
    [table],
  );

  return _table;
}

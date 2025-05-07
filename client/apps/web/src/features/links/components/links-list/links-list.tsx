import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { DataTable, EmptyState, useDataTable } from "@leww/ui";
import { LinkIcon, MousePointerClick } from "lucide-react";

import { useGetLinkListQuery } from "~/features/links/hooks";

import { columns } from "./columns";
import { LinksListActionBar } from "./links-list-action-bar";
import useLinksListParamsControl from "./use-links-list-params-control";

const LinksList: React.FC = () => {
  const { slug: workspaceSlug } = useParams<{ slug: string }>();
  const {
    isFiltered,
    pageIndex,
    pageSize,
    orderBy,
    orderDirection,
    handlePaginationChange,
    handleSortingChange,
  } = useLinksListParamsControl(workspaceSlug);

  const { data, isLoading } = useGetLinkListQuery({
    page: pageIndex,
    limit: pageSize,
    orderBy,
    orderDirection,
    workspaceSlug,
  });

  const totalPages = Math.ceil((data?.total || 0) / (data?.paging?.limit || 0));

  const normalizedData = useMemo(() => data?.data || [], [data]);
  const defaultSorting = useMemo(
    () => [
      {
        id: orderBy,
        desc: orderDirection === "desc",
      },
    ],
    [orderBy, orderDirection],
  );
  const { table } = useDataTable({
    data: normalizedData, // your data array
    columns, // your defined columns
    pageCount: totalPages,
    initialState: {
      sorting: defaultSorting,
      // columnPinning: { right: ["actions"] },
      pagination: { pageIndex: pageIndex - 1, pageSize },
    },
    getRowId: (originalRow) => originalRow.id,
    // Optionally, provide custom functions to push params to URL.
    onChangePagination: handlePaginationChange,
    onChangeSorting: handleSortingChange,
  });

  return (
    <>
      <DataTable
        table={table}
        actionBar={<LinksListActionBar table={table} />}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            title={isFiltered ? "No links found" : "No links yet"}
            description={isFiltered ? "Try a different search" : ""}
            cardContent={
              <>
                <LinkIcon className="size-4 text-neutral-700" />
                <div className="h-2.5 w-24 min-w-0 rounded-sm bg-neutral-200" />
                <div className="hidden grow items-center justify-end gap-1.5 text-neutral-500 xs:flex">
                  <MousePointerClick className="size-4 shrink-0 text-neutral-600/70" />
                </div>
              </>
            }
            className="border-none"
          />
        }
      />
    </>
  );
};

export default LinksList;

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useDataTable } from "~/hooks/use-data-table";

import { DataTable } from "~/components/shared";
import { useGetLinkListQuery } from "~/features/links/hooks";

import { columns } from "./columns";
import { LinksListActionBar } from "./links-list-action-bar";
import useLinksListParamsControl from "./use-links-list-params-control";

const LinksList: React.FC = () => {
  const { slug: workspaceSlug } = useParams<{ slug: string }>();
  const { pageIndex, pageSize, handlePaginationChange, handleSortingChange } =
    useLinksListParamsControl(workspaceSlug);

  const { data } = useGetLinkListQuery({
    page: pageIndex,
    limit: pageSize,
    workspaceSlug,
  });

  const totalPages = Math.ceil((data?.total || 0) / (data?.paging?.limit || 0));

  const normalizedData = useMemo(() => data?.data || [], [data]);
  const { table } = useDataTable({
    data: normalizedData, // your data array
    columns, // your defined columns
    pageCount: totalPages,
    initialState: {
      // sorting: [{ id: "createdAt", desc: true }],
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
      />
    </>
  );
};

export default LinksList;

import { useRouter, useSearchParams } from "next/navigation";

import { type PaginationState, type SortingState } from "~/types";
import { getPage } from "@leww/utils";
import { DEFAULT_ITEMS_PER_PAGE, locations } from "~/constants";

const useLinksListParamsControl = (slug: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageIndex = getPage(searchParams.get("page"), 1);
  const pageSize = Math.min(
    getPage(searchParams.get("pageSize"), DEFAULT_ITEMS_PER_PAGE),
    DEFAULT_ITEMS_PER_PAGE,
  );

  const handlePaginationChange = (pagination: PaginationState) => {
    router.push(
      locations.links(slug, {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      }),
      {
        scroll: false,
      },
    );
  };

  const handleSortingChange = (sorting: SortingState) => {
    router.push(
      locations.links(slug, {
        sort: sorting?.[0]?.id,
        order: sorting?.[0]?.desc ? "desc" : "asc",
      }),
      {
        scroll: false,
      },
    );
  };

  const isFiltered = ["q"].some((param) => searchParams.has(param));

  return {
    isFiltered,
    pageIndex,
    pageSize,
    handlePaginationChange,
    handleSortingChange,
  };
};

export default useLinksListParamsControl;

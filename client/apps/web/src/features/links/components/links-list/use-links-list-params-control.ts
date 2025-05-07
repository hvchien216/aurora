import { useRouter, useSearchParams } from "next/navigation";

import { type PaginationState, type SortingState } from "~/types";
import { getPage, getSortBy, getValue } from "@leww/utils";
import { DEFAULT_ITEMS_PER_PAGE, locations } from "~/constants";

import { ALLOWED_SORTING_FIELDS, type AllowedSortingFields } from "./constants";

const useLinksListParamsControl = (slug: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageIndex = getPage(searchParams.get("page"), 1);
  const pageSize = Math.min(
    getValue(searchParams.get("pageSize"), DEFAULT_ITEMS_PER_PAGE) as number,
    DEFAULT_ITEMS_PER_PAGE,
  );

  const orderBy = getSortBy(
    searchParams.get("sort"),
    [...ALLOWED_SORTING_FIELDS],
    "clicks",
  ) as AllowedSortingFields;

  const orderDirection = getSortBy(
    searchParams.get("order"),
    ["asc", "desc"],
    "desc",
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
    const sortParam = sorting?.[0];

    router.push(
      locations.links(
        slug,
        sortParam
          ? {
              sort: ALLOWED_SORTING_FIELDS.includes(sortParam.id)
                ? sortParam.id
                : "clicks",
              order: sortParam.desc ? "desc" : "asc",
            }
          : undefined,
      ),
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
    orderBy,
    orderDirection,
    handlePaginationChange,
    handleSortingChange,
  };
};

export default useLinksListParamsControl;

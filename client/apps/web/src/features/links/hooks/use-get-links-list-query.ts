import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import type { ListResponse, PagingParams } from "~/types";
import { customFetcher } from "~/lib";
import { injectParams } from "@leww/utils";
import { type Link } from "~/features/links/schemas";

import { GET_LINKS_LIST } from "./query-keys";

type Response = ListResponse<Link>;
type Variables = PagingParams & {
  workspaceSlug: string;
};

export const useGetLinkListQuery = <TData extends Response>(
  variables: Variables,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn" | "">,
) => {
  const url = injectParams(
    `/v1/links/workspace`,
    {
      page: "page",
      limit: "limit",
      orderBy: "orderBy",
      orderDirection: "orderDirection",
      workspaceSlug: "workspaceSlug",
    },
    {
      page: variables.page,
      limit: variables.limit,
      orderBy: variables.orderBy,
      orderDirection: variables.orderDirection,
      workspaceSlug: variables.workspaceSlug,
    },
  );
  return useQuery<TData>({
    ...options,
    queryKey: [GET_LINKS_LIST, variables],
    queryFn: customFetcher<TData>(url),
    retry: false,
  });
};

export function useInvalidateLinksWorkspace() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: [GET_LINKS_LIST],
    });
  };
}

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { customFetcher } from "~/lib";
import { type Workspace } from "~/features/workspaces/schemas";

import { GET_WORKSPACE_BY_SLUG } from "./query-keys";

type Response = Workspace;
type Variables = {
  slug: string;
};

export const useGeWorkSpaceBySlugQuery = <TData = Response>(
  variables: Variables,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn" | "">,
) => {
  const url = `/v1/workspaces/${variables.slug}/exists`;
  return useQuery<TData>({
    ...options,
    queryKey: [GET_WORKSPACE_BY_SLUG, variables],
    queryFn: customFetcher<TData>(url),
    retry: false,
  });
};

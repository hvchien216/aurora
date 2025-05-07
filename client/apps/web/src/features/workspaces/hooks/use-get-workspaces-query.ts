import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { customFetcher } from "~/lib";
import { type Workspace } from "~/features/workspaces/schemas";

import { GET_WORKSPACES } from "./query-keys";

type Response = Workspace[];

export const useGeWorkSpacesQuery = <TData = Response>(
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn" | "">,
) => {
  const url = `/v1/workspaces`;
  return useQuery<TData>({
    ...options,
    queryKey: [GET_WORKSPACES],
    queryFn: customFetcher<TData>(url),
    retry: false,
  });
};

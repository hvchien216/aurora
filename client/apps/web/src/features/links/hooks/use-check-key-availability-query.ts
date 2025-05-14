import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { customFetcher } from "~/lib";
import { injectParams } from "@leww/utils";

import { CHECK_KEY_AVAILABILITY } from "./query-keys";

type Response = {
  isAvailable: boolean;
  key: string;
};

type Variables = {
  key: string;
  workspaceId: string;
};

export const useCheckKeyAvailabilityQuery = <TData = Response>(
  variables: Variables,
  options?: Omit<
    UseQueryOptions<TData>,
    "queryKey" | "queryFn" | "refetchOnWindowFocus" | "retry"
  >,
) => {
  const url = injectParams(
    `/v1/links/check-key-availability`,
    {
      key: "key",
      workspaceId: "workspaceId",
    },
    {
      key: variables.key,
      workspaceId: variables.workspaceId,
    },
  );

  return useQuery<TData>({
    ...options,
    queryKey: [CHECK_KEY_AVAILABILITY, variables],
    queryFn: customFetcher<TData>(url),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

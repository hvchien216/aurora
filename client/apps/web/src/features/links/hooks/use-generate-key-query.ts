import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { customFetcher } from "~/lib";

import { GENERATE_KEY } from "./query-keys";

type Response = {
  key: string;
};

export const useGenerateKeyQuery = <TData = Response>(
  options?: Omit<
    UseQueryOptions<TData>,
    "queryKey" | "queryFn" | "refetchOnWindowFocus" | "retry"
  >,
) =>
  useQuery<TData>({
    ...options,
    queryKey: [GENERATE_KEY],
    queryFn: customFetcher<TData>(`/v1/links/generate-key`),
    retry: false,
    refetchOnWindowFocus: false,
  });

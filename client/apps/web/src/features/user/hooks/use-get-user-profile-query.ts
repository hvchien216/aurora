import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { customFetcher } from "~/lib";
import { type User } from "~/features/user/schemas";

import { GET_USER_PROFILE } from "./query-keys";

type Response = User;

export const useGetUserProfileQuery = <TData = Response>(
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn" | "">,
) =>
  useQuery<TData>({
    ...options,
    queryKey: [GET_USER_PROFILE],
    queryFn: customFetcher<TData>("/v1/profile"),
    retry: false,
  });

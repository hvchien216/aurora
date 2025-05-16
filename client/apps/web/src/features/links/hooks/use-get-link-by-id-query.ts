import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { AppError, customFetcher } from "~/lib";
import { type Link } from "~/features/links/schemas";

import { GET_LINK_BY_ID } from "./query-keys";

type Response = Link;

export const useGetLinkById = <TData extends Response>(
  id: string,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">,
) => {
  const url = `/v1/links/${id}`;

  return useQuery<TData, AppError>({
    ...options,
    queryKey: [GET_LINK_BY_ID, id],
    queryFn: customFetcher<TData>(url),
  });
};

export const useInvalidateLinkDetails = (id: string) => {
  const queryClient = useQueryClient();

  // const invalidateLinkQuery = () =>
  //   queryClient.invalidateQueries({
  //     predicate: (query) => {
  //       return (
  //         query.queryKey[0] === GET_LINK_BY_ID && query.queryKey[1]?.[0] === id
  //       );
  //     },
  //   });
  const invalidateLinkQuery = () =>
    queryClient.invalidateQueries({
      queryKey: [GET_LINK_BY_ID, [id]],
    });
  // This way is not working
  // queryClient.invalidateQueries({
  //   queryKey: [GET_LINK_BY_ID, id],
  // });

  return invalidateLinkQuery;
};

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { customMutator } from "~/lib";
import type { CreateLink, Link } from "~/features/links/schemas";

import { UPDATE_LINK } from "./query-keys";

type Response = Link;
type Variables = CreateLink; // Note: the payload is the same as the create link mutation

export const useUpdateLinkMutation = <TData = Response, TVariables = Variables>(
  id: Link["id"],
  options?: Omit<
    UseMutationOptions<TData, any, TVariables>,
    "mutationKey" | "mutationFn"
  >,
) => {
  return useMutation<TData, any, TVariables>({
    ...options,
    mutationKey: [UPDATE_LINK, id],
    mutationFn: (variables: TVariables) =>
      customMutator<TData, TVariables>("put", `/v1/links/${id}`, variables)(),
  });
};

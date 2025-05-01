import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { customMutator } from "~/lib";
import type { CreateLink, Link } from "~/features/links/schemas";

import { CREATE_LINK } from "./query-keys";

type Response = Link;
type Variables = CreateLink;
export const useCreateLinkMutation = <TData = Response, TVariables = Variables>(
  options?: Omit<
    UseMutationOptions<TData, any, TVariables>,
    "mutationKey" | "mutationFn"
  >,
) => {
  return useMutation<TData, any, TVariables>({
    ...options,
    mutationKey: [CREATE_LINK],
    mutationFn: (variables: TVariables) =>
      customMutator<TData, TVariables>("post", `/v1/links`, variables)(),
  });
};

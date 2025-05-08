import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { customMutator } from "~/lib";

import { BULK_DELETE_LINKS } from "./query-keys";

type Response = boolean;

type Variables = {
  ids: string[];
  workspaceId: string;
};

export const useBulkDeleteLinksMutation = <
  TData = Response,
  TVariables = Variables,
>(
  options?: Omit<
    UseMutationOptions<TData, any, TVariables>,
    "mutationKey" | "mutationFn"
  >,
) => {
  return useMutation<TData, any, TVariables>({
    ...options,
    mutationKey: [BULK_DELETE_LINKS],
    mutationFn: (variables: TVariables) =>
      customMutator<TData, TVariables>("delete", `/v1/links`, variables)(),
  });
};

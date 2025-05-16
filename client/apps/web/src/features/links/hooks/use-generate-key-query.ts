import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { customFetcher } from "~/lib";

import { GENERATE_KEY } from "./query-keys";

type Response = {
  key: string;
};

export const useGenerateKeyLazyQuery = <TData = Response>(
  options?: Omit<UseMutationOptions<TData, any>, "mutationKey" | "mutationFn">,
) => {
  return useMutation<TData, any>({
    ...options,
    mutationKey: [GENERATE_KEY],
    mutationFn: () => {
      return (async () => customFetcher<TData>(`/v1/links/generate-key`)())();
    },
  });
};

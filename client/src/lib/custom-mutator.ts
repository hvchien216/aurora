import { type QueryFunctionContext } from "@tanstack/react-query";

import { httpRequest } from "./http-request";

export const customMutator = <TData, TVariables>(
  method: "post" | "put" | "patch",
  url: string,
  variables?: TVariables,
): ((context?: QueryFunctionContext<readonly unknown[]>) => Promise<TData>) => {
  return async (context?: QueryFunctionContext<readonly unknown[]>) => {
    const controller = new AbortController();
    context?.signal?.addEventListener("abort", () => controller.abort(), {
      once: true,
    });

    const promise = httpRequest[method]<TData>(
      url,
      variables,
      controller.signal,
    );

    return promise;
  };
};

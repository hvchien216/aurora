import { type QueryFunctionContext } from "@tanstack/react-query";

import { httpRequest } from "./http-request";

interface CustomRequestInit extends RequestInit {
  auth?: boolean;
}
export const customMutator = <TData, TVariables>(
  method: "post" | "put" | "patch" | "delete",
  url: string,
  variables?: TVariables,
  options: CustomRequestInit = {},
): ((context?: QueryFunctionContext<readonly unknown[]>) => Promise<TData>) => {
  return async (context?: QueryFunctionContext<readonly unknown[]>) => {
    const controller = new AbortController();
    context?.signal?.addEventListener("abort", () => controller.abort(), {
      once: true,
    });

    const promise = httpRequest[method]<TData>(
      url,
      variables,
      {
        ...options,
      },
      controller.signal,
    );

    return promise;
  };
};

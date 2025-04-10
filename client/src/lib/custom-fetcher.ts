import { type QueryFunctionContext } from "@tanstack/react-query";

import { httpRequest } from "./http-request";

export const customFetcher = <TData>(
  url: string,
): ((context?: QueryFunctionContext<readonly unknown[]>) => Promise<TData>) => {
  return async (context?: QueryFunctionContext<readonly unknown[]>) => {
    const controller = new AbortController();
    context?.signal?.addEventListener("abort", () => controller.abort(), {
      once: true,
    });

    const promise = httpRequest.get<TData>(url, controller.signal);

    return promise;
  };
};

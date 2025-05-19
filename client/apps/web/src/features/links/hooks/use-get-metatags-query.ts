import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { customFetcher } from "~/lib";
import { injectParams } from "@leww/utils";

import { GET_METATAGS } from "./query-keys";

type Response = {
  description: string | null;
  image: string | null;
  poweredBy: string;
  title: string | null;
};
type Variables = {
  url: string;
};

export const useGetMetaTagsQuery = <TData = Response>(
  variables: Variables,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn" | "">,
) => {
  const url = injectParams(
    `${process.env.NEXT_PUBLIC_HOST_URL}/api/metatags`,
    {
      url: "url",
    },
    {
      url: variables.url,
    },
  );
  return useQuery<TData>({
    ...options,
    queryKey: [GET_METATAGS, variables],
    queryFn: customFetcher<TData>(url),
    retry: false,
  });
};

import { injectParams } from "~/utils";

export type LinksListOptions = {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
};

export const locations = {
  links: (slug: string, options?: LinksListOptions) =>
    injectParams(
      `/w/${slug}`,
      {
        page: "page",
        pageSize: "pageSize",
        sort: "sort",
        order: "order",
      },
      options,
    ),
};

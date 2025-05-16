import { injectParams } from "@leww/utils";

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
  linkDetails: (slug: string, id: string) => `/w/${slug}/links/${id}`,
};

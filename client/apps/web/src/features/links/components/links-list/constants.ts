export const ALLOWED_SORTING_FIELDS = [
  "clicks",
  "createdAt",
  "key",
  "url",
] as const;

export type AllowedSortingFields = (typeof ALLOWED_SORTING_FIELDS)[number];

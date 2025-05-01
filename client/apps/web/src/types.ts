export type TokenPayload = {
  sub: string;
  role: UserRole;
  exp: number;
};

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

// ======== Table Component ========
export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export type ColumnSort = {
  desc: boolean;
  id: string;
};
export type SortingState = ColumnSort[];

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: Extract<keyof TData, string>;
}

//  ======== End Table Component ========

type Sorting = {
  sort?: string;
  order?: "asc" | "desc";
};

type Paging = Sorting & {
  page: number;
  limit: number;
};

export type ListResponse<T> = {
  data: T[];
  paging: Paging;
  total: number;
  filter: any;
};

export interface PagingParams extends Paging {}

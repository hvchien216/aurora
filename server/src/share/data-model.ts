import z from 'zod';

export const workspaceSchema = z.object({
  id: z.string().cuid(),
  name: z.string().trim().min(3, 'can not empty'),
  slug: z.string().trim().min(3, 'can not empty'),
  logo: z.string().nullable(),
  inviteCode: z.string().nullable(),
  totalLinks: z.number().int().default(0),
  totalClicks: z.number().int().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Workspace = z.infer<typeof workspaceSchema>;

export const pagingDTOSchema = z.object({
  page: z.coerce
    .number()
    .min(1, { message: 'Page number must be at least 1' })
    .default(1),
  limit: z.coerce
    .number()
    .min(1, { message: 'Limit must be at least 1' })
    .max(100)
    .default(20),
  sort: z.string().optional(),
  order: z.string().optional(),
});
export interface PagingDTO extends z.infer<typeof pagingDTOSchema> {
  total?: number;
}

export type Paginated<E> = {
  data: E[];
  paging: PagingDTO;
  total: number;
};

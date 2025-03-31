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

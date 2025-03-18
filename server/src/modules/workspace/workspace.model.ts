import { z } from 'zod';

export enum WorkspaceRole {
  OWNER = 'owner',
  MEMBER = 'member',
}

// business errors
export const ErrWorkspaceNotFound = new Error('Workspace not found');
export const ErrInvalidInviteCode = new Error('Invalid invite code');
export const ErrGenerateInviteCodeFailed = new Error(
  'Failed to generate a unique invite code after multiple attempts',
);
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

export const workspaceUserSchema = z.object({
  id: z.string().cuid(),
  role: z.nativeEnum(WorkspaceRole).default(WorkspaceRole.MEMBER),
  userId: z.string(),
  workspaceId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Workspace = z.infer<typeof workspaceSchema>;
export type WorkspaceUser = z.infer<typeof workspaceUserSchema>;

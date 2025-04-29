import { z } from "zod";

const WORKSPACE_ROLE = {
  OWNER: "owner",
  MEMBER: "member",
} as const;

export type WorkspaceRole = keyof typeof WORKSPACE_ROLE;

export const workspaceSchema = z.object({
  id: z.string().cuid(),
  name: z.string().trim().min(3, "can not empty"),
  slug: z.string().trim().min(3, "can not empty"),
  logo: z.string().nullable(),
  inviteCode: z.string().nullable(),
  totalLinks: z.number().int().default(0),
  totalClicks: z.number().int().default(0),
  role: z.nativeEnum(WORKSPACE_ROLE).default(WORKSPACE_ROLE.MEMBER),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Workspace = z.infer<typeof workspaceSchema>;

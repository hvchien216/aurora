import { z } from 'zod';
import { WorkspaceRole } from './workspace.model';

// Create Workspace DTO
export const createWorkspaceDTOSchema = z.object({
  name: z.string().min(3).max(50),
});

export type CreateWorkspaceDTO = z.infer<typeof createWorkspaceDTOSchema>;

export const createWorkspaceRPCDTOSchema = createWorkspaceDTOSchema.extend({
  ownerId: z.string().uuid(),
});

export type CreateWorkspaceRPCDTO = z.infer<typeof createWorkspaceRPCDTOSchema>;

// Update Workspace DTO
export const updateWorkspaceDTOSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  logo: z.string().url().nullable().optional(),
});

export type UpdateWorkspaceDTO = z.infer<typeof updateWorkspaceDTOSchema>;

// Join Workspace DTO
export const joinWorkspaceDTOSchema = z.object({
  inviteCode: z.string(),
});

export type JoinWorkspaceDTO = z.infer<typeof joinWorkspaceDTOSchema>;

// Update User Role DTO
export const updateUserRoleDTOSchema = z.object({
  role: z.nativeEnum(WorkspaceRole),
});

export type UpdateUserRoleDTO = z.infer<typeof updateUserRoleDTOSchema>;

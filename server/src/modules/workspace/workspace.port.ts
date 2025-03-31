import {
  Workspace,
  WorkspaceRole,
  WorkspaceUser,
  WorkspaceWithUserRole,
} from './workspace.model';

export interface IWorkspaceRepository {
  create(workspace: Workspace): Promise<Workspace>;
  update(id: string, workspace: Partial<Workspace>): Promise<Workspace>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Workspace | null>;
  findBySlug(slug: string): Promise<Workspace | null>;
  findByInviteCode(code: string): Promise<Workspace | null>;
  addUser(workspaceUser: WorkspaceUser): Promise<WorkspaceUser>;
  removeUser(workspaceId: string, userId: string): Promise<void>;
  updateUserRole(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole,
  ): Promise<void>;
  getUsers(workspaceId: string): Promise<WorkspaceUser[]>;
  getUserWorkspaces(userId: string): Promise<WorkspaceWithUserRole[]>;
}

export interface IWorkspaceService {
  createWorkspace(name: string, ownerId: string): Promise<Workspace>;
  updateWorkspace(id: string, data: Partial<Workspace>): Promise<Workspace>;
  deleteWorkspace(id: string): Promise<void>;
  getWorkspace(id: string): Promise<Workspace>;
  getWorkspaceBySlug(slug: string): Promise<Workspace | null>;
  generateInviteCode(workspaceId: string): Promise<string>; // returns invite code
  joinWorkspace(inviteCode: string, userId: string): Promise<WorkspaceUser>;
  removeUser(workspaceId: string, userId: string): Promise<void>;
  updateUserRole(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole,
  ): Promise<void>;
  getUserWorkspaces(userId: string): Promise<WorkspaceWithUserRole[]>;
}

import { Injectable, Inject } from '@nestjs/common';
import { IWorkspaceService, IWorkspaceRepository } from './workspace.port';
import {
  Workspace,
  WorkspaceUser,
  WorkspaceRole,
  ErrWorkspaceNotFound,
  ErrInvalidInviteCode,
  ErrGenerateInviteCodeFailed,
  WorkspaceWithUserRole,
} from './workspace.model';
import {
  createWorkspaceDTOSchema,
  updateWorkspaceDTOSchema,
} from './workspace.dto';
import { WORKSPACE_REPOSITORY } from './workspace.di-tokens';
import { generateSlug } from '../../utils/slug';
import { generateInviteCode } from 'src/utils/invite-code';
import { AppError } from 'src/share';
import { v7 } from 'uuid';
import { nanoid } from 'src/utils';

@Injectable()
export class WorkspaceService implements IWorkspaceService {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly workspaceRepository: IWorkspaceRepository,
  ) {}

  async _getRandomSlug(name: string): Promise<string> {
    const key = generateSlug(name) + nanoid();

    // Check if key already exists
    const existing = await this.workspaceRepository.findBySlug(key);
    if (existing) {
      /* recursively get random key till it gets one that's available */
      return this._getRandomSlug(name);
    }

    return key;
  }

  async createWorkspace(name: string, ownerId: string): Promise<Workspace> {
    const data = createWorkspaceDTOSchema.parse({ name });

    const newWorkspaceId = v7();

    let slug = generateSlug(data.name);

    if (!slug) {
      slug = await this._getRandomSlug(data.name);
    }

    const workspace: Workspace = {
      id: newWorkspaceId,
      name: data.name,
      slug,
      logo: null,
      inviteCode: null,
      totalLinks: 0,
      totalClicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdWorkspace = await this.workspaceRepository.create(workspace);

    const newId = v7();
    await this.workspaceRepository.addUser({
      id: newId,
      workspaceId: createdWorkspace.id,
      userId: ownerId,
      role: WorkspaceRole.OWNER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return createdWorkspace;
  }

  async updateWorkspace(
    id: string,
    data: Partial<Workspace>,
  ): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) {
      throw AppError.from(ErrWorkspaceNotFound, 400);
    }

    const validatedData = updateWorkspaceDTOSchema.parse(data);
    return this.workspaceRepository.update(id, validatedData);
  }

  async deleteWorkspace(id: string): Promise<void> {
    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) {
      throw AppError.from(ErrWorkspaceNotFound, 400);
    }

    await this.workspaceRepository.delete(id);
  }

  async getWorkspace(id: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) {
      throw AppError.from(ErrWorkspaceNotFound, 400);
    }
    return workspace;
  }

  async getWorkspaceBySlug(slug: string): Promise<Workspace | null> {
    const workspace = await this.workspaceRepository.findBySlug(slug);

    return workspace;
  }

  async generateInviteCode(workspaceId: string): Promise<string> {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw AppError.from(ErrWorkspaceNotFound, 400);
    }

    let inviteCode: string = '';
    let isUnique = false;

    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    while (!isUnique && attempts < MAX_ATTEMPTS) {
      inviteCode = generateInviteCode();
      const existingWorkspace =
        await this.workspaceRepository.findByInviteCode(inviteCode);
      if (!existingWorkspace) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw AppError.from(ErrGenerateInviteCodeFailed, 500);
    }

    await this.workspaceRepository.update(workspaceId, { inviteCode });

    return inviteCode;
  }

  async joinWorkspace(
    inviteCode: string,
    userId: string,
  ): Promise<WorkspaceUser> {
    const workspace =
      await this.workspaceRepository.findByInviteCode(inviteCode);
    if (!workspace) {
      throw AppError.from(ErrInvalidInviteCode, 400);
    }

    const newId = v7();

    const workspaceUser: WorkspaceUser = {
      id: newId,
      workspaceId: workspace.id,
      userId: userId,
      role: WorkspaceRole.MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Clear invite code after use
    await this.workspaceRepository.update(workspace.id, { inviteCode: null });

    return await this.workspaceRepository.addUser(workspaceUser);
  }

  async removeUser(workspaceId: string, userId: string): Promise<void> {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw AppError.from(ErrWorkspaceNotFound, 400);
    }

    await this.workspaceRepository.removeUser(workspaceId, userId);
  }

  async updateUserRole(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole,
  ): Promise<void> {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw AppError.from(ErrWorkspaceNotFound, 400);
    }

    await this.workspaceRepository.updateUserRole(workspaceId, userId, role);
  }

  async getUserWorkspaces(userId: string): Promise<WorkspaceWithUserRole[]> {
    return this.workspaceRepository.getUserWorkspaces(userId);
  }
}

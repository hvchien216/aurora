import { Injectable } from '@nestjs/common';
import { IWorkspaceRepository } from './workspace.port';
import {
  Workspace,
  WorkspaceRole,
  WorkspaceUser,
  WorkspaceWithUserRole,
} from './workspace.model';
import {
  Prisma,
  WorkspacesUsers as WorkspacesUsersPrisma,
} from '@prisma/client';
import prisma from 'src/share/components/prisma';

@Injectable()
export class WorkspacePrismaRepository implements IWorkspaceRepository {
  async create(workspace: Workspace): Promise<Workspace> {
    try {
      return await prisma.workspace.create({
        data: workspace,
      });
    } catch (error) {
      // TODO: forward error to service layer
      // TODO: create DBErr extends AppErr and use it here
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Slug or invite code already exists.');
        }
      }
      throw error;
    }
  }

  async update(id: string, workspace: Partial<Workspace>): Promise<Workspace> {
    return prisma.workspace.update({
      where: { id },
      data: workspace,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.workspace.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<Workspace | null> {
    return prisma.workspace.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Workspace | null> {
    return prisma.workspace.findUnique({
      where: { slug },
    });
  }

  async findByInviteCode(code: string): Promise<Workspace | null> {
    return prisma.workspace.findUnique({
      where: { inviteCode: code },
    });
  }

  async addUser(workspaceUser: WorkspaceUser): Promise<WorkspaceUser> {
    const data = await prisma.workspacesUsers.create({
      data: workspaceUser,
    });

    return this._toModelUser(data);
  }

  async removeUser(workspaceId: string, userId: string): Promise<void> {
    await prisma.workspacesUsers.delete({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: workspaceId,
        },
      },
    });
  }

  async updateUserRole(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole,
  ): Promise<void> {
    await prisma.workspacesUsers.update({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: workspaceId,
        },
      },
      data: { role },
    });
  }

  async getUsers(workspaceId: string): Promise<WorkspaceUser[]> {
    const data = await prisma.workspacesUsers.findMany({
      where: { workspaceId: workspaceId },
      include: { user: true },
    });

    return data.map(this._toModelUser);
  }

  async getUserWorkspaces(userId: string): Promise<WorkspaceWithUserRole[]> {
    const workspaceUsers = await prisma.workspacesUsers.findMany({
      where: { userId: userId },
      include: { workspace: true },
    });

    return workspaceUsers.map((wu) => ({
      ...wu.workspace,
      role: wu.role as WorkspaceRole,
    }));
  }

  private _toModelUser(data: WorkspacesUsersPrisma): WorkspaceUser {
    return { ...data, role: data.role as WorkspaceRole } as WorkspaceUser;
  }
}

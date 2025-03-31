import { Injectable } from '@nestjs/common';
import { User as UserPrisma, UserStatus } from '@prisma/client';
import { UserCondDTO, UserUpdateDTO } from './user.dto';
import { User } from './user.model';
import { IUserRepository } from './user.port';
import prisma from 'src/share/components/prisma';
import { UserRole } from 'src/share';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  async get(id: string): Promise<User | null> {
    const data = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!data) return null;

    return this._toModel(data);
  }
  async findByCond(cond: UserCondDTO): Promise<User | null> {
    const data = await prisma.user.findFirst({
      where: cond,
    });
    if (!data) return null;
    return this._toModel(data);
  }
  async listByIds(ids: string[]): Promise<User[]> {
    const data = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return data.map(this._toModel);
  }

  async insert(user: User): Promise<User> {
    const data = await prisma.user.create({
      data: user,
    });

    return this._toModel(data);
  }

  async update(id: string, dto: UserUpdateDTO): Promise<User> {
    const data = await prisma.user.update({
      where: { id },
      data: dto,
    });

    return this._toModel(data);
  }

  async updateManyDefaultWorkspace(
    oldSlug: string,
    slug: string,
  ): Promise<void> {
    await prisma.user.updateMany({
      where: {
        defaultWorkspace: oldSlug,
      },
      data: {
        defaultWorkspace: slug,
      },
    });
  }

  private _toModel(data: UserPrisma): User {
    return { ...data, role: data.role as UserRole } as User;
  }
}

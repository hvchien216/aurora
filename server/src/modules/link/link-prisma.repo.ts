import { Injectable } from '@nestjs/common';
import { ILinkRepository } from './link.port';
import { Link } from './link.model';
import prisma from 'src/share/components/prisma';

@Injectable()
export class LinkPrismaRepository implements ILinkRepository {
  async create(link: Link): Promise<Link> {
    const data = await prisma.link.create({
      data: link,
    });

    return data;
  }

  async findById(id: string): Promise<Link | null> {
    const link = await prisma.link.findUnique({
      where: { id },
    });

    return link;
  }

  async findByKey(key: string): Promise<Link | null> {
    const link = await prisma.link.findFirst({
      where: { key },
    });

    return link;
  }

  async findByWorkspace(workspaceId: string): Promise<Link[]> {
    const links = await prisma.link.findMany({
      where: { workspaceID: workspaceId },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return links;
  }

  async update(id: string, link: Partial<Link>): Promise<Link> {
    const updated = await prisma.link.update({
      where: { id },
      data: {
        ...(link.title !== undefined && { title: link.title }),
        ...(link.url && { url: link.url }),
        ...(link.description !== undefined && {
          description: link.description,
        }),
        ...(link.workspaceID && { workspaceID: link.workspaceID }),
        ...(link.archived !== undefined && { archived: link.archived }),
        ...(link.key && { key: link.key }),
      },
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    await prisma.link.delete({
      where: { id },
    });
  }

  async incrementClicks(id: string): Promise<void> {
    await prisma.link.update({
      where: { id },
      data: {
        clicks: { increment: 1 },
        lastClicked: new Date(),
      },
    });
  }
}

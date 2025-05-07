import { Injectable } from '@nestjs/common';
import { ILinkRepository } from './link.port';
import { Link, LinkCondDTO } from './link.model';
import prisma from 'src/share/components/prisma';
import { Paginated, PagingDTO } from 'src/share';

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

  async list(
    cond: Omit<LinkCondDTO, 'workspaceSlug'> & { workspaceId: string },
    paging: PagingDTO,
  ): Promise<Paginated<Link>> {
    const { workspaceId, title: _title, ...rest } = cond;
    const { orderBy, orderDirection, defaultOrderDirection, defaultOrder } =
      paging;
    let where = {
      ...rest,
    };

    if (workspaceId) {
      where = {
        ...where,
        workspaceId: workspaceId,
      } as Omit<LinkCondDTO, 'workspaceSlug'> & { workspaceId: string };
    }

    const order =
      orderBy != null
        ? {
            [orderBy]:
              orderDirection?.toLowerCase() ??
              defaultOrderDirection?.toLowerCase(),
          }
        : defaultOrder;

    const total = await prisma.link.count({ where });

    const skip = (paging.page - 1) * paging.limit;

    const result = await prisma.link.findMany({
      where,
      take: paging.limit,
      skip,
      orderBy: order,
    });
    return {
      data: result,
      paging,
      total,
    };
  }

  async update(id: string, link: Partial<Link>): Promise<Link> {
    const updated = await prisma.link.update({
      where: { id },
      data: {
        ...(link.proxy !== undefined && { proxy: link.proxy }),
        ...(link.image !== undefined && { image: link.image }),
        ...(link.video !== undefined && { video: link.video }),
        ...(link.title !== undefined && { title: link.title }),
        ...(link.url && { url: link.url }),
        ...(link.description !== undefined && {
          description: link.description,
        }),
        ...(link.workspaceId && { workspaceId: link.workspaceId }),
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

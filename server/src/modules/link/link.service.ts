import { Inject, Injectable } from '@nestjs/common';
import { ILinkService, ILinkRepository } from './link.port';
import {
  Link,
  CreateLinkDTO,
  ErrLinkNotFound,
  ErrUnauthorizedAccess,
  ErrKeyAlreadyExists,
  ClickLinkDTO,
  LinkCondDTO,
  linkCondDTOSchema,
  clickLinkDTOSchema,
} from './link.model';
import {
  AppError,
  ICacheService,
  IWorkspaceRPC,
  Paginated,
  PagingDTO,
  pagingDTOSchema,
} from 'src/share';
import { v7 } from 'uuid';
import { LINK_REPOSITORY } from './link.di-tokens';
import { nanoid } from 'src/utils';
import { CACHE_SERVICE, WORKSPACE_RPC } from 'src/share/share.di-tokens';

@Injectable()
export class LinkService implements ILinkService {
  constructor(
    @Inject(LINK_REPOSITORY)
    private readonly linkRepository: ILinkRepository,
    @Inject(WORKSPACE_RPC) private readonly workspaceRpc: IWorkspaceRPC,
    @Inject(CACHE_SERVICE)
    private readonly cacheService: ICacheService,
  ) {}

  async createLink(dto: CreateLinkDTO, userId: string): Promise<Link> {
    // If key is provided, check if it already exists
    if (dto.key) {
      const existing = await this.linkRepository.findByKey(dto.key);
      if (existing) {
        throw AppError.from(ErrKeyAlreadyExists, 400);
      }
    }

    let key = dto.key;

    if (!key) {
      key = await this._getRandomKey();
    }

    const newLink: Link = {
      id: v7(),
      key: key,
      url: dto.url,
      title: dto.title || null,
      description: dto.description || null,
      archived: false,
      workspaceId: dto.workspaceId,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      clicks: 0,
      lastClicked: null,
    };

    const link = await this.linkRepository.create(newLink);

    await this.cacheService.setObject(`link:${key}`, link, 5 * 60);

    return link;
  }

  async _getRandomKey(): Promise<string> {
    const key = nanoid();

    // Check if key already exists
    const existing = await this.linkRepository.findByKey(key);
    if (existing) {
      /* recursively get random key till it gets one that's available */
      return this._getRandomKey();
    }

    return key;
  }

  async getLink(id: string): Promise<Link> {
    const link = await this.linkRepository.findById(id);
    if (!link) {
      throw AppError.from(ErrLinkNotFound, 404);
    }
    return link;
  }

  async getLinkByKey(key: string): Promise<Link> {
    let link = await this.cacheService.getObject<Link>(`link:${key}`);

    if (!link) {
      link = await this.linkRepository.findByKey(key);
    }
    if (!link) {
      throw AppError.from(ErrLinkNotFound, 404);
    }

    await this.cacheService.setObject(`link:${key}`, link, 5 * 60);

    return link;
  }

  async listInWorkspace(
    cond: LinkCondDTO,
    paging: PagingDTO,
  ): Promise<Paginated<Link>> {
    cond = linkCondDTOSchema.parse(cond);
    paging = pagingDTOSchema.parse(paging);

    const { workspaceSlug, ...restCond } = cond;

    const workspace = await this.workspaceRpc.findBySlug(cond.workspaceSlug);

    if (!workspace) {
      return {
        data: [],
        paging,
        total: 0,
      };
    }

    const condition = {
      ...restCond,
      workspaceId: workspace.id,
    };
    return await this.linkRepository.list(condition, paging);
  }

  async updateLink(
    id: string,
    dto: Partial<CreateLinkDTO>,
    userId: string,
  ): Promise<Link> {
    const link = await this.linkRepository.findById(id);
    if (!link) {
      throw AppError.from(ErrLinkNotFound, 404);
    }

    if (link.userId !== userId) {
      throw AppError.from(ErrUnauthorizedAccess, 403);
    }

    // If updating key, check if new key already exists
    if (dto.key && dto.key !== link.key) {
      const existing = await this.linkRepository.findByKey(dto.key);
      if (existing) {
        throw AppError.from(ErrKeyAlreadyExists, 400);
      }
    }

    return this.linkRepository.update(id, {
      ...dto,
      updatedAt: new Date(),
    });
  }

  async deleteLink(id: string, userId: string): Promise<void> {
    const link = await this.linkRepository.findById(id);
    if (!link) {
      throw AppError.from(ErrLinkNotFound, 404);
    }

    // TODO: phase Multiple Users on a workspace then any user can edit a link
    if (link.userId !== userId) {
      throw AppError.from(ErrUnauthorizedAccess, 403);
    }

    await this.linkRepository.delete(id);
  }

  async recordClick(dto: ClickLinkDTO): Promise<Link> {
    const { key, ip, isBot, clickId } = clickLinkDTOSchema.parse(dto);
    let link = await this.cacheService.getObject<Link>(`link:${key}`);

    if (!link) {
      link = await this.getLinkByKey(key);
    }

    if (!link) {
      throw AppError.from(ErrLinkNotFound, 404);
    }

    await this.cacheService.setObject(`link:${key}`, link, 5 * 60);

    if (isBot) return link;
    const cacheKey = `recordClick:${key}:${ip}`;

    const cachedClickId = await this.cacheService.get(cacheKey);
    if (cachedClickId) {
      return link;
    }

    // cache the click ID in Redis for 1 hour
    const AN_HOUR = 60 * 60;

    //  only record 1 click per hour
    await Promise.allSettled([
      this.cacheService.set(cacheKey, clickId, AN_HOUR),
      this.linkRepository.incrementClicks(link.id),
    ]);

    return link;
  }
}

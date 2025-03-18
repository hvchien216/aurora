import { Inject, Injectable } from '@nestjs/common';
import { ILinkService, ILinkRepository } from './link.port';
import {
  Link,
  CreateLinkDTO,
  ErrLinkNotFound,
  ErrUnauthorizedAccess,
  ErrKeyAlreadyExists,
} from './link.model';
import { AppError } from 'src/share';
import { v7 } from 'uuid';
import { LINK_REPOSITORY } from './link.di-tokens';
import { nanoid } from 'src/utils';

@Injectable()
export class LinkService implements ILinkService {
  constructor(
    @Inject(LINK_REPOSITORY)
    private readonly linkRepository: ILinkRepository,
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

    return this.linkRepository.create(newLink);
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
    const link = await this.linkRepository.findByKey(key);
    if (!link) {
      throw AppError.from(ErrLinkNotFound, 404);
    }
    return link;
  }

  async getWorkspaceLinks(
    workspaceId: string,
    userId: string,
  ): Promise<Link[]> {
    return this.linkRepository.findByWorkspace(workspaceId);
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

  async recordClick(id: string): Promise<void> {
    const link = await this.linkRepository.findById(id);
    if (!link) {
      throw AppError.from(ErrLinkNotFound, 404);
    }

    await this.linkRepository.incrementClicks(id);
  }
}

import { Link, CreateLinkDTO, ClickLinkDTO } from './link.model';

export interface ILinkRepository {
  create(link: Link): Promise<Link>;
  findById(id: string): Promise<Link | null>;
  findByKey(key: string): Promise<Link | null>;
  findByWorkspace(workspaceId: string): Promise<Link[]>;
  update(id: string, link: Partial<Link>): Promise<Link>;
  delete(id: string): Promise<void>;
  incrementClicks(id: string): Promise<void>;
}

export interface ILinkService {
  createLink(dto: CreateLinkDTO, userId?: string): Promise<Link>;
  getLink(id: string): Promise<Link>;
  getLinkByKey(key: string): Promise<Link>;
  getWorkspaceLinks(workspaceId: string, userId: string): Promise<Link[]>;
  updateLink(
    id: string,
    dto: Partial<CreateLinkDTO>,
    userId: string,
  ): Promise<Link>;
  deleteLink(id: string, userId: string): Promise<void>;
  recordClick(dto: ClickLinkDTO, link: Link): Promise<void>;
}

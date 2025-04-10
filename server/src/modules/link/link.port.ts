import { Paginated, PagingDTO } from 'src/share';
import { Link, CreateLinkDTO, ClickLinkDTO, LinkCondDTO } from './link.model';

export interface ILinkRepository {
  create(link: Link): Promise<Link>;
  findById(id: string): Promise<Link | null>;
  findByKey(key: string): Promise<Link | null>;
  list(
    cond: Omit<LinkCondDTO, 'workspaceSlug'> & { workspaceId: string },
    paging: PagingDTO,
  ): Promise<Paginated<Link>>;
  update(id: string, link: Partial<Link>): Promise<Link>;
  delete(id: string): Promise<void>;
  incrementClicks(id: string): Promise<void>;
}

export interface ILinkService {
  createLink(dto: CreateLinkDTO, userId?: string): Promise<Link>;
  getLink(id: string): Promise<Link>;
  getLinkByKey(key: string): Promise<Link>;
  listInWorkspace(
    cond: LinkCondDTO,
    paging: PagingDTO,
  ): Promise<Paginated<Link>>;
  updateLink(
    id: string,
    dto: Partial<CreateLinkDTO>,
    userId: string,
  ): Promise<Link>;
  deleteLink(id: string, userId: string): Promise<void>;
  recordClick(dto: ClickLinkDTO): Promise<Link>;
}

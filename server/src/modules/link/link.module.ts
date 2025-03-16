import { Module } from '@nestjs/common';
import { LinkHttpController } from './link-http.controller';
import { LinkService } from './link.service';
import { LinkPrismaRepository } from './link-prisma.repo';
import { LINK_SERVICE, LINK_REPOSITORY } from './link.di-tokens';

@Module({
  controllers: [LinkHttpController],
  providers: [
    {
      provide: LINK_SERVICE,
      useClass: LinkService,
    },
    {
      provide: LINK_REPOSITORY,
      useClass: LinkPrismaRepository,
    },
  ],
})
export class LinkModule {}

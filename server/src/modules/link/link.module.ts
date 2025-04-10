import { Module } from '@nestjs/common';
import { LinkHttpController } from './link-http.controller';
import { LinkService } from './link.service';
import { LinkPrismaRepository } from './link-prisma.repo';
import { LINK_SERVICE, LINK_REPOSITORY } from './link.di-tokens';
import { ShareModule } from 'src/share/share.module';
import { REMOTE_AUTH_GUARD } from 'src/share/share.di-tokens';
import { RemoteAuthGuard } from 'src/share/guards';

@Module({
  imports: [ShareModule],
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
    {
      provide: REMOTE_AUTH_GUARD,
      useClass: RemoteAuthGuard,
    },
  ],
})
export class LinkModule {}

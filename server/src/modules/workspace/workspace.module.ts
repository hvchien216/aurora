import { Module } from '@nestjs/common';
import { WorkspaceHttpController } from './workspace-http.controller';
import { WorkspaceRPCHttpController } from './workspace-rpc-http.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspacePrismaRepository } from './workspace-prisma.repo';
import {
  USER_RPC,
  WORKSPACE_REPOSITORY,
  WORKSPACE_SERVICE,
} from './workspace.di-tokens';
import { ShareModule } from '../../share/share.module';
import { REMOTE_AUTH_GUARD } from 'src/share/share.di-tokens';
import { RemoteAuthGuard } from 'src/share/guards';
import { UserRPC } from './workspace.rpc-client';

@Module({
  imports: [ShareModule],
  controllers: [WorkspaceHttpController, WorkspaceRPCHttpController],
  providers: [
    {
      provide: WORKSPACE_REPOSITORY,
      useClass: WorkspacePrismaRepository,
    },
    {
      provide: WORKSPACE_SERVICE,
      useClass: WorkspaceService,
    },
    { provide: REMOTE_AUTH_GUARD, useClass: RemoteAuthGuard },
    {
      provide: USER_RPC,
      useClass: UserRPC,
    },
  ],
})
export class WorkspaceModule {}

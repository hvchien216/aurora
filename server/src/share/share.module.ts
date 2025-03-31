import { Module } from '@nestjs/common';
import { TOKEN_INTROSPECTOR, WORKSPACE_RPC } from 'src/share/share.di-tokens';
import { TokenIntrospectRPCClient, WorkspaceRPCClient } from 'src/share/rpc';

@Module({
  providers: [
    {
      provide: TOKEN_INTROSPECTOR,
      useClass: TokenIntrospectRPCClient,
    },
    {
      provide: WORKSPACE_RPC,
      useClass: WorkspaceRPCClient,
    },
  ],
  exports: [TOKEN_INTROSPECTOR, WORKSPACE_RPC],
})
export class ShareModule {}

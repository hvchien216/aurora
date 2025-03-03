import { Module } from '@nestjs/common';
import { TOKEN_INTROSPECTOR } from 'src/share/share.di-tokens';
import { TokenIntrospectRPCClient } from 'src/share/rpc';

@Module({
  providers: [
    {
      provide: TOKEN_INTROSPECTOR,
      useClass: TokenIntrospectRPCClient,
    },
  ],
  exports: [TOKEN_INTROSPECTOR],
})
export class ShareModule {}

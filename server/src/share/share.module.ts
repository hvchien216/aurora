import { Module } from '@nestjs/common';
import {
  CACHE_SERVICE,
  TOKEN_INTROSPECTOR,
  WORKSPACE_RPC,
} from './share.di-tokens';
import { TokenIntrospectRPCClient, WorkspaceRPCClient } from './rpc';
import { RedisClient } from './components';
import { ConfigService } from '@nestjs/config';
import { RedisConfig } from 'src/share/config/config.interface';

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
    {
      provide: CACHE_SERVICE,
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.getOrThrow<RedisConfig>('redis').url;
        const defaultTTL = configService.get<RedisConfig>('redis')?.defaultTTL;
        await RedisClient.init(redisUrl, defaultTTL);
        return RedisClient.getInstance();
      },
      inject: [ConfigService],
    },
  ],
  exports: [TOKEN_INTROSPECTOR, WORKSPACE_RPC, CACHE_SERVICE],
})
export class ShareModule {}

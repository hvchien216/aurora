import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

import { StorageProvider, type Config } from './config.interface';

const myEnv = dotenv.config({
  // path: process.env.NODE_ENV === 'production' ? '.env' : `.env.${process.env.NODE_ENV}`
});
dotenvExpand.expand(myEnv);

const port = process.env.PORT || '3000';

const config: Config = {
  app: {
    port,
    host: `http://localhost:${port}`,
  },
  cors: {
    enabled: true,
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
  rpc: {
    introspectURL: `http://localhost:${port}/v1/rpc/introspect`,
    workspacesURL: `http://localhost:${port}/v1`,
    userURL: `http://localhost:${port}/v1`,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis:topsecret_redis//localhost:6379',
    defaultTTL: parseInt(process.env.REDIS_DEFAULT_TTL || '3600', 10),
  },
  storage: {
    provider:
      (process.env.STORAGE_PROVIDER as StorageProvider) || StorageProvider.S3,
    bucket: process.env.STORAGE_BUCKET || '',
    region: process.env.STORAGE_REGION || 'auto',
    endpoint: process.env.STORAGE_ENDPOINT, // For R2
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || '',
    maxSizeInBytes: parseInt(process.env.MAX_FILE_SIZE_BYTES || '10485760', 10), // 10MB default
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/ogg',
    ],
  },
};
export default (): Config => config;

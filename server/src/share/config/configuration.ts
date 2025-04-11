import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

import { type Config } from './config.interface';

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
};
export default (): Config => config;

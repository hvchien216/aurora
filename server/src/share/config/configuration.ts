import { type Config } from './config.interface';

const port = process.env.PORT || '3000';

const config: Config = {
  app: {
    port,
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
  },
};
export default (): Config => config;

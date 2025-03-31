import { type Config } from './config.interface';

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
};
export default (): Config => config;

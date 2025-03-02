import { type Config } from './config.interface';

const config: Config = {
  app: {
    port: process.env.PORT || '3000',
  },
  cors: {
    enabled: true,
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};
export default (): Config => config;

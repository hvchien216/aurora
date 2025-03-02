import { type Config } from './config.interface';

const config: Config = {
  app: {
    port: process.env.PORT || '3000',
  },
  cors: {
    enabled: true,
  },
};
export default (): Config => config;

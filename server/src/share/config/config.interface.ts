export interface Config {
  app: AppConfig;
  cors: CorsConfig;
  security: SecurityConfig;
  rpc: RPCConfig;
  redis: RedisConfig;
}

export interface AppConfig {
  port: string;
  host: string;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}

export interface RPCConfig {
  introspectURL: string;
  workspacesURL: string;
  userURL: string;
}

export interface RedisConfig {
  url: string;
  defaultTTL: number;
}

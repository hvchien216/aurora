export interface Config {
  app: AppConfig;
  cors: CorsConfig;
  security: SecurityConfig;
  rpc: RPCConfig;
}

export interface AppConfig {
  port: string;
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
}

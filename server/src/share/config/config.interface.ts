export interface Config {
  app: AppConfig;
  cors: CorsConfig;
  security: SecurityConfig;
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

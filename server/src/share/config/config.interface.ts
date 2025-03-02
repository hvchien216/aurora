export interface Config {
  app: AppConfig;
  cors: CorsConfig;
}

export interface AppConfig {
  port: string;
}

export interface CorsConfig {
  enabled: boolean;
}

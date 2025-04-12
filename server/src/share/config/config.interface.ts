export interface Config {
  app: AppConfig;
  cors: CorsConfig;
  security: SecurityConfig;
  rpc: RPCConfig;
  redis: RedisConfig;
  storage: CloudStorageConfig;
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

export enum StorageProvider {
  S3 = 's3',
  R2 = 'r2',
}
export interface CloudStorageConfig {
  provider: StorageProvider;
  bucket: string;
  region: string;
  endpoint?: string; // For R2
  accessKeyId: string;
  secretAccessKey: string;
  maxSizeInBytes: number;
  allowedMimeTypes: string[];
}

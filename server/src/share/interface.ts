import { Workspace } from './data-model';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface Requester extends TokenPayload {}

export interface ReqWithRequester {
  requester: Requester;
}
export interface ReqWithRequesterOpt {
  requester?: Requester;
}
export interface TokenPayload {
  sub: string;
  role: UserRole;
}

export interface ITokenProvider {
  // generate access token
  generateToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload | null>;

  generateRefreshToken(payload: TokenPayload): Promise<string>;
  verifyRefreshToken(token: string): Promise<TokenPayload | null>;

  // generate token pair
  generateTokens(payload: TokenPayload): Promise<Token>;
}

export type TokenIntrospectResult = {
  payload: TokenPayload | null;
  error?: Error;
  isOk: boolean;
};

export interface ITokenIntrospect {
  introspect(token: string): Promise<TokenIntrospectResult>;
}

// =========WORKSPACE RPC==========

export interface IWorkspaceRPC {
  create(name: string, ownerId: string): Promise<Workspace | null>;
  findBySlug(slug: string): Promise<Workspace | null>;
  getUserWorkspaces(userId: string): Promise<Workspace[]>;
}

export interface ICacheService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlInSeconds?: number): Promise<void>;
  getObject<T>(key: string): Promise<T | null>;
  setObject(key: string, value: object, ttlInSeconds?: number): Promise<void>;
}

// =========CLOUD STORAGE CONFIGURATION==========

export interface FileMetadata {
  key: string;
  fileName: string;
  mimeType: string;
  sizeInBytes: number;
  url: string;
}

export interface SignedUrlResponse {
  url: string;
  key: string;
}
export interface IStorageProvider {
  /**
   * Upload a file buffer to storage
   */
  uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    prefix?: string,
  ): Promise<FileMetadata>;

  /**
   * Generate a presigned URL for client-side upload
   */
  getSignedUploadUrl(
    fileName: string,
    mimeType: string,
    prefix?: string,
    expiresInSeconds?: number,
  ): Promise<SignedUrlResponse>;

  /**
   * Generate a presigned URL for downloading a file
   */
  getSignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;

  /**
   * Get a public URL (if the file is accessible publicly)
   */
  getPublicUrl(key: string): string;

  /**
   * Delete a file from storage
   */
  deleteFile(key: string): Promise<void>;
}

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
}

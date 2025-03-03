export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
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
}

export type TokenIntrospectResult = {
  payload: TokenPayload | null;
  error?: Error;
  isOk: boolean;
};

export interface ITokenIntrospect {
  introspect(token: string): Promise<TokenIntrospectResult>;
}

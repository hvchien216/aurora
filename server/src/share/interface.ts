export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
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

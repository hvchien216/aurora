export type TokenPayload = {
  sub: string;
  role: UserRole;
  exp: number;
};

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

import { z } from 'zod';
import { userSchema } from './user.model';

export const userRegistrationDTOSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    username: true,
    password: true,
  })
  .required();

export const userLoginDTOSchema = userSchema
  .pick({
    username: true,
    password: true,
  })
  .required();

export interface UserRegistrationDTO
  extends z.infer<typeof userRegistrationDTOSchema> {}
export interface UserLoginDTO extends z.infer<typeof userLoginDTOSchema> {}

export const userCondDTOSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    username: true,
    role: true,
    status: true,
  })
  .partial();

export interface UserCondDTO extends z.infer<typeof userCondDTOSchema> {}

export const refreshTokenDTOSchema = z
  .object({
    token: z.string().min(1, new Error('Token is invalid').message),
  })
  .required();

export interface RefreshTokenDTO
  extends z.infer<typeof refreshTokenDTOSchema> {}

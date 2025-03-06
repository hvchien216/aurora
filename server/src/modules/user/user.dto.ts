import { z } from 'zod';
import { userSchema } from './user.model';

export const userRegistrationDTOSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    username: true,
    password: true,
    email: true,
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
    email: true,
    firstName: true,
    lastName: true,
    username: true,
    role: true,
    status: true,
  })
  .partial();

export const userUpdateDTOSchema = userSchema
  .pick({
    username: true,
    firstName: true,
    lastName: true,
    password: true,
    salt: true,
    role: true,
    status: true,
  })
  .partial();

export interface UserUpdateDTO extends z.infer<typeof userUpdateDTOSchema> {}

export interface UserCondDTO extends z.infer<typeof userCondDTOSchema> {}

export const refreshTokenDTOSchema = z
  .object({
    token: z.string().min(1, new Error('Token is invalid').message),
  })
  .required();

export interface RefreshTokenDTO
  extends z.infer<typeof refreshTokenDTOSchema> {}

export const googleLoginSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    username: true,
    email: true,
  })
  .required();

export interface GoogleLoginDTO extends z.infer<typeof googleLoginSchema> {}

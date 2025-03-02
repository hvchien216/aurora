import { UserRole } from 'src/share';
import { z } from 'zod';

// business errors
export const ErrFirstNameAtLeast2Chars = new Error(
  'First name must be at least 2 characters',
);
export const ErrLastNameAtLeast2Chars = new Error(
  'Last name must be at least 2 characters',
);
export const ErrUsernameAtLeast3Chars = new Error(
  'Username must be at least 3 characters',
);
export const ErrUsernameAtMost25Chars = new Error(
  'Username must be at most 25 characters',
);
export const ErrUsernameInvalid = new Error(
  'Username must contain only letters, numbers and underscore (_)',
);
export const ErrPasswordAtLeast6Chars = new Error(
  'Password must be at least 6 characters',
);
export const ErrBirthdayInvalid = new Error('Birthday is invalid');
export const ErrGenderInvalid = new Error('Gender is invalid');
export const ErrRoleInvalid = new Error('Role is invalid');
export const ErrUsernameExisted = new Error('Username is already existed');
export const ErrInvalidUsernameAndPassword = new Error(
  'Invalid username and password',
);
export const ErrUserInactivated = new Error('User is inactivated or banned');
export const ErrInvalidToken = new Error('Invalid token');

// enums
export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  DELETED = 'deleted',
}

// data model
export const userSchema = z.object({
  id: z.string().uuid(),
  username: z
    .string()
    .min(3, ErrFirstNameAtLeast2Chars.message)
    .max(25, ErrUsernameAtMost25Chars.message)
    .regex(/^[a-zA-Z0-9_]+$/, ErrUsernameInvalid.message),
  password: z.string().min(6, ErrPasswordAtLeast6Chars.message),
  salt: z.string().min(8),
  firstName: z.string().min(2, ErrFirstNameAtLeast2Chars.message),
  lastName: z.string().min(2, ErrLastNameAtLeast2Chars.message),
  role: z.nativeEnum(UserRole, ErrRoleInvalid),
  status: z.nativeEnum(UserStatus).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export interface User extends z.infer<typeof userSchema> {}

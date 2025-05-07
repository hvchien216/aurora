import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(25)
    .regex(/^[a-zA-Z0-9_]+$/),
  salt: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  defaultWorkspace: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

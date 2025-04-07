import { z } from 'zod';

// Business errors
export const ErrWorkspaceNotFound = new Error('Workspace not found');

export const ErrLinkNotFound = new Error('Link not found');
export const ErrInvalidURL = new Error('Invalid URL');
export const ErrTitleTooLong = new Error(
  'Title must be less than 255 characters',
);
export const ErrUnauthorizedAccess = new Error(
  'Unauthorized access to this link',
);
export const ErrKeyAlreadyExists = new Error('Short link key already exists');
export const ErrInvalidKey = new Error(
  'Invalid short link key. Use only alphanumeric characters and hyphens',
);

export const linkSchema = z.object({
  id: z.string().uuid(),
  key: z.string().regex(/^[a-zA-Z0-9-]+$/, { message: ErrInvalidKey.message }),
  url: z.string().url({ message: ErrInvalidURL.message }),
  title: z.string().max(255, { message: ErrTitleTooLong.message }).nullable(),
  description: z.string().nullable(),
  archived: z.boolean().default(false),
  workspaceId: z.string().uuid().nullable(),
  userId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  clicks: z.number().default(0),
  lastClicked: z.date().nullable(),
});

export type Link = z.infer<typeof linkSchema>;

export const createLinkDTOSchema = z.object({
  url: z.string().url({ message: ErrInvalidURL.message }),
  key: z
    .string()
    .regex(/^[a-zA-Z0-9-]+$/, { message: ErrInvalidKey.message })
    .optional(),
  title: z.string().max(255, { message: ErrTitleTooLong.message }).optional(),
  description: z.string().optional(),
  workspaceId: z.string().uuid().nullable(),
  tags: z.array(z.string().uuid()).optional(),
});

export type CreateLinkDTO = z.infer<typeof createLinkDTOSchema>;

export const validDomainRegex = new RegExp(
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
);
export const clickLinkDTOSchema = z.object({
  key: z.string().regex(/^[a-zA-Z0-9-]+$/, { message: ErrInvalidKey.message }),
  clickId: z.string().uuid(),
  domain: z
    .string()
    .min(1, 'Missing required `domain` parameter.')
    .refine((v) => validDomainRegex.test(v), { message: 'Invalid domain' }),
  isBot: z.boolean().optional(),
});

export type ClickLinkDTO = z.infer<typeof clickLinkDTOSchema>;

// TODO: allow filter by tags, domain, ...
export const linkCondDTOSchema = z.object({
  title: z.string().optional(),
  workspaceSlug: z.string(),
});

export type LinkCondDTO = z.infer<typeof linkCondDTOSchema>;

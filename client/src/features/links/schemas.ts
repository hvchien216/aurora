import { z } from "zod";

export const ErrLinkNotFound = new Error("Link not found");
export const ErrInvalidURL = new Error("Invalid URL");
export const ErrTitleTooLong = new Error(
  "Title must be less than 255 characters",
);
export const ErrUnauthorizedAccess = new Error(
  "Unauthorized access to this link",
);
export const ErrInvalidKey = new Error(
  "Invalid short link key. Use only alphanumeric characters and hyphens",
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

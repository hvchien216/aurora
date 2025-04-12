import { z } from 'zod';

export const getSignedUrlDTOSchema = z.object({
  fileName: z.string(),
  mimeType: z.string(),
});

export type GetSignedUrlDTO = z.infer<typeof getSignedUrlDTOSchema>;

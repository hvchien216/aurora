import z from "zod";

export const authCallbackSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

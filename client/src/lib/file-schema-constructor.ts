import { z } from "zod";

type UploadOptions = {
  allowedMimeTypes?: string[];
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  minFiles?: number;
};

export type SchemaBuilderConfig = UploadOptions & {
  withUrl?: boolean;
};

export const fileErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
});

const fileUploadSchema = z.object({
  url: z.string().url().optional(),
  originalFile: z.instanceof(File).optional(),
  preview: z.string().optional(),
  errors: z.array(fileErrorSchema).optional(),
});

export function fileSchemaConstructor(config: UploadOptions) {
  let schema = z.array(
    fileUploadSchema
      .refine(
        (f) => {
          if (f.url) return true;

          if (!config.allowedMimeTypes?.length) return true;

          return config.allowedMimeTypes.some((type) => {
            if (type.endsWith("/*")) {
              const prefix = type.split("/")[0];
              return f?.originalFile?.type?.startsWith(`${prefix}/`);
            }
            return f?.originalFile?.type === type;
          });
        },
        {
          message: `File type must be one of: ${config?.allowedMimeTypes?.join(", ")}`,
        },
      )
      .refine(
        (f) =>
          !config.maxFileSize ||
          (f?.originalFile?.size || 0) <= config.maxFileSize,
        {
          message: `File must be smaller than ${(config?.maxFileSize || 0) / 1024 / 1024}MB`,
        },
      ),
  );

  if (config.minFiles !== undefined) {
    schema = schema.min(config.minFiles, {
      message: `Please upload at least ${config.minFiles} file(s).`,
    });
  }

  if (config.maxFiles !== undefined) {
    schema = schema.max(config.maxFiles, {
      message: `You can upload up to ${config.maxFiles} file(s).`,
    });
  }

  return schema;
}

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useDropzone,
  type FileError,
  type FileRejection,
} from "react-dropzone";

import { useUploadMutation } from "./use-upload-mutation";

interface FileWithPreview extends File {
  preview?: string;
  errors: readonly FileError[];
}

interface UseUploadOptions {
  allowedMimeTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
}

export type UseUploadReturn = ReturnType<typeof useUpload>;

export const useUpload = (options: UseUploadOptions) => {
  const {
    allowedMimeTypes = [],
    maxFileSize = Number.POSITIVE_INFINITY,
    maxFiles = 1,
  } = options;

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [errors, setErrors] = useState<{ name: string; message: string }[]>([]);
  const [successes, setSuccesses] = useState<string[]>([]);

  const { mutateAsync: uploadFile, isPending } = useUploadMutation();

  const isSuccess = useMemo(() => {
    if (errors.length === 0 && successes.length === 0) return false;
    return errors.length === 0 && successes.length === files.length;
  }, [errors.length, successes.length, files.length]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const validFiles = acceptedFiles
        .filter((file) => !files.find((x) => x.name === file.name))
        .map((file) => {
          (file as FileWithPreview).preview = URL.createObjectURL(file);
          (file as FileWithPreview).errors = [];
          return file as FileWithPreview;
        });

      const invalidFiles = fileRejections.map(({ file, errors }) => {
        (file as FileWithPreview).preview = URL.createObjectURL(file);
        (file as FileWithPreview).errors = errors;
        return file as FileWithPreview;
      });

      setFiles([...files, ...validFiles, ...invalidFiles]);
    },
    [files],
  );

  const dropzoneProps = useDropzone({
    onDrop,
    noClick: true,
    accept: allowedMimeTypes.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {},
    ),
    maxSize: maxFileSize,
    maxFiles: maxFiles,
    multiple: maxFiles !== 1,
  });

  const onUpload = useCallback(async () => {
    const filesWithErrors = errors.map((x) => x.name);
    const filesToUpload =
      filesWithErrors.length > 0
        ? [
            ...files.filter((f) => filesWithErrors.includes(f.name)),
            ...files.filter((f) => !successes.includes(f.name)),
          ]
        : files;

    const results = await Promise.all(
      filesToUpload.map(async (file) => {
        try {
          await uploadFile({ file });
          return { name: file.name, message: undefined };
        } catch (error: any) {
          return {
            name: file.name,
            message: error?.message || "Unknown error occurred",
          };
        }
      }),
    );

    const failed = results.filter((r) => r.message !== undefined);
    const succeeded = results.filter((r) => r.message === undefined);

    setErrors(failed);
    setSuccesses((prev) =>
      Array.from(new Set([...prev, ...succeeded.map((r) => r.name)])),
    );
  }, [files, errors, successes, uploadFile]);

  useEffect(() => {
    if (files.length === 0) setErrors([]);

    if (files.length <= maxFiles) {
      let changed = false;
      const newFiles = files.map((file) => {
        if (file.errors.some((e) => e.code === "too-many-files")) {
          file.errors = file.errors.filter((e) => e.code !== "too-many-files");
          changed = true;
        }
        return file;
      });
      if (changed) setFiles(newFiles);
    }
  }, [files, maxFiles]);

  return {
    files,
    setFiles,
    onUpload,
    isUploading: isPending,
    successes,
    errors,
    setErrors,
    isSuccess,
    maxFileSize,
    maxFiles,
    allowedMimeTypes,
    ...dropzoneProps,
  };
};

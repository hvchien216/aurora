import { useCallback, useEffect } from "react";
import {
  useDropzone,
  type FileError,
  type FileRejection,
} from "react-dropzone";

import { useControllableState } from "./use-controllable-state"; // adjust path as needed

export interface FileWithPreview extends File {
  preview?: string;
  url?: string; // cloud image url
  errors: readonly FileError[];
}

interface UseUploadOptions {
  allowedMimeTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  value?: FileWithPreview[];
  defaultValue?: FileWithPreview[];
  onChange?: (files: FileWithPreview[]) => void;
  disabled?: boolean;
}

export type UseUploadReturn = ReturnType<typeof useUpload>;

export const useUpload = (options: UseUploadOptions) => {
  const {
    allowedMimeTypes = [],
    maxFileSize = Number.POSITIVE_INFINITY,
    maxFiles = 1,
    value,
    defaultValue = [],
    onChange,
    disabled,
  } = options;

  const [files, setFiles] = useControllableState<FileWithPreview[]>({
    prop: value || undefined,
    defaultProp: defaultValue || [],
    onChange,
  });

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
    [files, setFiles],
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
    multiple: maxFiles != 1,
    disabled: files.length > maxFiles || disabled,
  });

  useEffect(() => {
    if (files.length <= maxFiles) {
      let changed = false;
      const newFiles = files.map((file) => {
        if (file.errors?.some((e) => e.code === "too-many-files")) {
          file.errors = file.errors?.filter((e) => e.code !== "too-many-files");
          changed = true;
        }
        return file;
      });
      if (changed) setFiles(newFiles);
    }
  }, [files, maxFiles, setFiles]);

  const handleRemoveFile = useCallback(
    (file: FileWithPreview) => {
      setFiles(() => files.filter((_file) => _file != file));
      const inp = dropzoneProps.inputRef;
      inp.current.value = "";
    },
    [files, setFiles, dropzoneProps.inputRef],
  );

  return {
    files,
    setFiles,
    maxFileSize,
    maxFiles,
    allowedMimeTypes,
    handleRemoveFile,
    ...dropzoneProps,
  };
};

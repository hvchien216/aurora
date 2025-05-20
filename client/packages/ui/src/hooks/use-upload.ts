import { useCallback, useEffect, useRef } from "react";
import {
  useDropzone,
  type FileError,
  type FileRejection,
} from "react-dropzone";

import { useControllableState } from "./use-controllable-state"; // adjust path as needed

export interface FileWithPreview {
  originalFile: File; // use this for uploading
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

export const useUpload = (
  options: UseUploadOptions,
): {
  files: FileWithPreview[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
  maxFileSize: number;
  maxFiles: number;
  allowedMimeTypes: string[];
  handleRemoveFile: (file: FileWithPreview) => void;
  handlePaste: (event: ClipboardEvent) => void;
  dropzoneRef: React.RefObject<HTMLDivElement>;
} & ReturnType<typeof useDropzone> => {
  const {
    allowedMimeTypes = [],
    maxFileSize = Number.POSITIVE_INFINITY,
    maxFiles = 1,
    value,
    defaultValue = [],
    onChange,
    disabled,
  } = options;

  const dropzoneRef = useRef<HTMLDivElement>(null!);

  const [files, setFiles] = useControllableState<FileWithPreview[]>({
    prop: value || undefined,
    defaultProp: defaultValue || [],
    onChange,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const validFiles = acceptedFiles
        .filter((file) => !files.find((x) => x.originalFile.name === file.name))
        .map((file) => ({
          originalFile: file,
          preview: URL.createObjectURL(file),
          errors: [],
        }));

      const invalidFiles = fileRejections.map(({ file, errors }) => ({
        originalFile: file,
        preview: URL.createObjectURL(file),
        errors: errors,
      }));

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
    disabled: files.length >= maxFiles || disabled,
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
      if (inp.current) inp.current.value = "";
    },
    [files, setFiles, dropzoneProps.inputRef],
  );

  // Handle clipboard paste
  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      if (disabled || files.length >= maxFiles) return;

      const items = event.clipboardData?.items;
      if (!items) return;

      const imageItems = Array.from(items).filter(
        (item) => item.kind === "file" && item.type.startsWith("image/"),
      );

      if (imageItems.length === 0) return;

      // Prevent default paste behavior
      event.preventDefault();

      // Process only the first image if maxFiles is 1
      const itemsToProcess =
        maxFiles === 1 ? imageItems.slice(0, 1) : imageItems;

      const newFiles = itemsToProcess
        .map((item) => {
          const file = item.getAsFile();
          if (!file) return null;

          // Check file size
          const isFileTooLarge = file.size > maxFileSize;

          return {
            originalFile: file,
            preview: URL.createObjectURL(file),
            errors: isFileTooLarge
              ? [
                  {
                    code: "file-too-large",
                    message: `File is larger than ${maxFileSize} bytes`,
                  },
                ]
              : [],
          };
        })
        .filter(Boolean) as FileWithPreview[];

      if (newFiles.length > 0) {
        if (maxFiles === 1) {
          // Replace existing files if maxFiles is 1
          setFiles(newFiles);
        } else {
          // Add to existing files if maxFiles > 1
          const totalFiles = [...files, ...newFiles];
          const filesToAdd = totalFiles.slice(0, maxFiles);
          setFiles(filesToAdd);
        }
      }
    },
    [files, setFiles, maxFiles, maxFileSize, disabled],
  );

  return {
    files,
    setFiles,
    maxFileSize,
    maxFiles,
    allowedMimeTypes,
    handleRemoveFile,
    handlePaste,
    dropzoneRef,
    ...dropzoneProps,
  };
};

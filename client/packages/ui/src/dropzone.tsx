"use client";

import { createContext, useContext, type PropsWithChildren } from "react";
import { CloudUpload, File, Upload, X } from "lucide-react";
import { cn, getUploadedFileName } from "@leww/utils";

import { BlurImageNative } from "./blur-image";
import { Button } from "./button";
import { useIsMobile, type UseUploadReturn } from "./hooks";
import { ShimmerDots } from "./shimmer-dots";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export const formatBytes = (
  bytes: number,
  decimals = 2,
  size?: "bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB",
) => {
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (bytes === 0 || bytes === undefined)
    return size !== undefined ? `0 ${size}` : "0 bytes";
  const i =
    size !== undefined
      ? sizes.indexOf(size)
      : Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

type DropzoneContextType = Omit<
  UseUploadReturn,
  "getRootProps" | "getInputProps"
>;

const DropzoneContext = createContext<DropzoneContextType | undefined>(
  undefined,
);

type DropzoneProps = UseUploadReturn & {
  className?: string;
};

const Dropzone = ({
  className,
  children,
  getRootProps,
  getInputProps,
  ...restProps
}: PropsWithChildren<DropzoneProps>) => {
  const isActive = restProps.isDragActive;
  const isInvalid =
    (restProps.isDragActive && restProps.isDragReject) ||
    restProps.files.some(
      (file) => file.errors?.length !== 0 && file.errors !== undefined,
    );

  return (
    <DropzoneContext.Provider value={{ ...restProps }}>
      <div
        {...getRootProps({
          className: cn(
            "relative rounded-lg border border-gray-300  bg-card text-center text-foreground transition-colors duration-300",
            className,
            restProps.files.length >= restProps.maxFiles
              ? "border-solid"
              : "border-dashed",
            isActive && "border-primary bg-primary/10",
            isInvalid && "border-destructive bg-destructive/10",
          ),
        })}
      >
        <input {...getInputProps()} />
        {children}
      </div>
    </DropzoneContext.Provider>
  );
};

const DropzoneContent = ({ className }: { className?: string }) => {
  const { files, handleRemoveFile, maxFileSize, maxFiles } =
    useDropzoneContext();

  // const exceedMaxFiles = files.length > maxFiles;

  // ----- NEW LOGIC FOR SINGLE FILE CASE -----
  // If maxFiles is 1 and one file is present, render a full-cover preview.
  if (maxFiles === 1 && files.length === 1) {
    const fileWithPreview = files[0];
    const previewUrl = fileWithPreview?.preview || fileWithPreview?.url;
    const fileName =
      fileWithPreview?.originalFile?.name ||
      getUploadedFileName(fileWithPreview?.url || "");

    return (
      <div className={cn("relative size-full", className)}>
        {fileWithPreview?.originalFile?.type?.startsWith("image/") ||
        fileWithPreview?.url?.startsWith("http") ? (
          <BlurImageNative
            src={previewUrl}
            alt={fileName}
            className="size-full rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-lg bg-muted">
            <File size={18} />
          </div>
        )}
        {/* Remove button */}
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute right-2 top-2 z-10 h-8 w-fit px-1.5"
              onClick={() => handleRemoveFile(fileWithPreview!)}
            >
              <X className="mx-px size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Remove</TooltipContent>
        </Tooltip>
        {/* Status overlay */}
        {Number(fileWithPreview?.errors?.length) > 0 ? (
          <p className="absolute bottom-2 left-2 rounded bg-white/70 px-1 text-xs text-destructive">
            {fileWithPreview?.errors
              .map((e) =>
                e.message.startsWith("File is larger than")
                  ? `File is larger than ${formatBytes(
                      maxFileSize,
                      2,
                    )} (Size: ${formatBytes(fileWithPreview?.originalFile?.size, 2)})`
                  : e.message,
              )
              .join(", ")}
          </p>
        ) : null}
      </div>
    );
  }
  // ----- END SINGLE FILE LOGIC -----

  // If not in the single file case, retain the multi-file rendering logic:
  return (
    <div className={cn("flex flex-col px-2", className)}>
      {files.map((fileWithPreview, idx) => {
        const previewUrl = fileWithPreview?.preview || fileWithPreview?.url;
        const fileName =
          fileWithPreview?.originalFile?.name ||
          getUploadedFileName(fileWithPreview?.url || "");
        const fileSize = fileWithPreview?.originalFile?.size || 0;
        const isOnCloud = fileWithPreview?.url?.startsWith("http");
        return (
          <div
            key={`${fileWithPreview?.originalFile?.name}-${idx}`}
            className="flex items-center gap-x-4 border-b py-2 first:mt-4 last:mb-4"
          >
            {fileWithPreview?.originalFile?.type?.startsWith("image/") ||
            isOnCloud ? (
              <div className="relative">
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border bg-muted">
                  <BlurImageNative
                    src={previewUrl}
                    alt={fileName}
                    className="object-cover"
                  />
                </div>
                {isOnCloud && (
                  <CloudUpload className="absolute -right-2 top-0 z-10 size-3.5 rounded-full border bg-white/70 p-0.5 text-green-500" />
                )}
              </div>
            ) : (
              <div className="flex size-10 items-center justify-center rounded border bg-muted">
                <File size={18} />
              </div>
            )}

            <div className="flex shrink grow flex-col items-start truncate">
              <p title={fileName} className="max-w-full truncate text-sm">
                {fileName}
              </p>
              {fileWithPreview.errors?.length > 0 ? (
                <p className="text-xs text-destructive">
                  {fileWithPreview.errors
                    .map((e) =>
                      e.message.startsWith("File is larger than")
                        ? `File is larger than ${formatBytes(
                            maxFileSize,
                            2,
                          )} (Size: ${formatBytes(fileSize, 2)})`
                        : e.message,
                    )
                    .join(", ")}
                </p>
              ) : !isOnCloud ? (
                <p className="text-xs text-muted-foreground">
                  {formatBytes(fileSize, 2)}
                </p>
              ) : null}
            </div>

            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="link"
                  size="icon"
                  className="px-0.5 text-muted-foreground"
                  onClick={() => handleRemoveFile(fileWithPreview!)}
                >
                  <X className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Remove</TooltipContent>
            </Tooltip>
          </div>
        );
      })}
      {/* {exceedMaxFiles && (
        <p className="mt-2 text-left text-sm text-destructive">
          You may upload only up to {maxFiles} file
          {maxFiles > 1 ? "s" : ""}, please remove {files.length - maxFiles}{" "}
          {files.length - maxFiles > 1 ? "files" : "file"}.
        </p>
      )} */}
    </div>
  );
};

const DropzoneEmptyState = ({ className }: { className?: string }) => {
  const { maxFiles, inputRef, maxFileSize, files } = useDropzoneContext();
  const isMobile = useIsMobile();

  if (maxFiles === 1 && files.length > 0) {
    return null;
  }

  return (
    <>
      {!isMobile && (
        <ShimmerDots className="pointer-events-none opacity-30 [mask-image:radial-gradient(40%_80%,transparent_50%,black)]" />
      )}
      <div
        className={cn(
          "flex flex-col items-center gap-y-2 pt-2",
          files.length === 0 && "h-full justify-center",
          className,
        )}
      >
        <Upload size={20} className="text-muted-foreground" />
        <p className="text-sm">
          Upload
          {!!maxFiles && maxFiles > 1 ? ` ${maxFiles}` : ""} file
          {(!maxFiles || maxFiles > 1) && "s"}
        </p>
        <div className="flex flex-col items-center gap-y-1">
          <p className="text-xs text-muted-foreground">
            Drag and drop or{" "}
            <a
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer underline transition hover:text-foreground"
            >
              select {maxFiles === 1 ? `file` : "files"}
            </a>{" "}
            to upload
          </p>
          {maxFileSize !== Number.POSITIVE_INFINITY && (
            <p className="text-xs text-muted-foreground">
              Maximum file size: {formatBytes(maxFileSize, 2)}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

const useDropzoneContext = () => {
  const context = useContext(DropzoneContext);

  if (!context) {
    throw new Error("useDropzoneContext must be used within a Dropzone");
  }

  return context;
};

export { Dropzone, DropzoneContent, DropzoneEmptyState, useDropzoneContext };

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { CloudUpload, File, Upload, X } from "lucide-react";
import { cn, getUploadedFileName } from "@leww/utils";

import { BlurImageNative } from "./blur-image";
import { Button } from "./button";
import {
  useIsMobile,
  type FileWithPreview,
  type UseUploadReturn,
} from "./hooks";
import { ShimmerDots } from "./shimmer-dots";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { VideoPlayerPreview } from "./video-player";

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
> & {
  previewStyle?: PreviewStyleType;
  renderPreview?: (
    file: FileWithPreview,
    previewStyle: PreviewStyleType,
  ) => React.ReactNode;
};

const DropzoneContext = createContext<DropzoneContextType | undefined>(
  undefined,
);

export type ShapeType = "rectangle" | "square" | "circle" | "custom";
export type PreviewStyleType = "cover" | "contain" | "fill" | "none";

export type DropzoneProps = UseUploadReturn & {
  className?: string;
  shape?: ShapeType;
  previewStyle?: PreviewStyleType;
  renderPreview?: (
    file: UseUploadReturn["files"][0],
    previewStyle: PreviewStyleType,
  ) => React.ReactNode;
};

const Dropzone = ({
  className,
  children,
  getRootProps,
  getInputProps,
  shape = "rectangle",
  previewStyle = "cover",
  renderPreview,
  ...restProps
}: PropsWithChildren<DropzoneProps>) => {
  const isActive = restProps.isDragActive;
  const isInvalid =
    (restProps.isDragActive && restProps.isDragReject) ||
    restProps.files.some(
      (file) => file.errors?.length !== 0 && file.errors !== undefined,
    );
  const onPaste = restProps.handlePaste;
  const [isFocused, setIsFocused] = useState(false);

  // Set up paste event listener
  useEffect(() => {
    const controller = new AbortController();

    const handlePaste = (e: ClipboardEvent) => {
      if (isFocused) {
        onPaste(e);
        setIsFocused(false);
      }
    };

    document.addEventListener("paste", handlePaste, {
      signal: controller.signal,
    });
    return () => {
      controller.abort();
    };
  }, [isFocused, onPaste]);

  // Generate shape classes
  const shapeClasses = {
    rectangle: "",
    square: "aspect-square",
    circle: "aspect-square rounded-full",
    custom: "",
  };

  return (
    <DropzoneContext.Provider
      value={{ ...restProps, previewStyle, renderPreview }}
    >
      <div
        {...getRootProps({
          className: cn(
            "relative rounded-lg border border-gray-300 bg-card text-center text-foreground transition-colors duration-300",
            className,
            shapeClasses[shape],
            restProps.files.length >= restProps.maxFiles
              ? "border-solid"
              : "border-dashed",
            isActive && "border-primary bg-primary/10",
            isInvalid && "border-destructive bg-destructive/10",
            isFocused && "ring-2 ring-primary ring-opacity-50",
          ),
          tabIndex: 0,
          onFocus: () => setIsFocused(true),
          onBlur: () => setIsFocused(false),
          ref: restProps.dropzoneRef,
        })}
      >
        <input {...getInputProps()} />
        {children}
      </div>
    </DropzoneContext.Provider>
  );
};

const DropzoneContent = ({ className }: { className?: string }) => {
  const {
    files,
    handleRemoveFile,
    maxFileSize,
    maxFiles,
    previewStyle,
    renderPreview,
  } = useDropzoneContext();

  // ----- NEW LOGIC FOR SINGLE FILE CASE -----
  // If maxFiles is 1 and one file is present, render a full-cover preview.
  if (maxFiles === 1 && files.length === 1) {
    const fileWithPreview = files[0];

    // If custom render function is provided, use it
    if (renderPreview) {
      return (
        <div className={cn("relative size-full", className)}>
          {renderPreview(fileWithPreview, previewStyle || "cover")}

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

    const previewUrl = fileWithPreview?.preview || fileWithPreview?.url;
    const fileName =
      fileWithPreview?.originalFile?.name ||
      getUploadedFileName(fileWithPreview?.url || "");

    // Check if it's a video file
    const isVideo =
      fileWithPreview?.originalFile?.type?.startsWith("video/") ||
      (fileWithPreview?.url &&
        fileWithPreview.url.match(/\.(mp4|webm|ogg|mov)($|\?)/i));

    return (
      <div className={cn("relative size-full", className)}>
        {isVideo ? (
          <VideoPlayerPreview
            src={previewUrl || ""}
            className="size-full overflow-hidden rounded-lg object-cover"
            muted
            loop
            showPreviewButton
          />
        ) : fileWithPreview?.originalFile?.type?.startsWith("image/") ||
          fileWithPreview?.url?.startsWith("http") ? (
          <BlurImageNative
            src={previewUrl}
            alt={fileName}
            className={cn(
              "size-full rounded-lg",
              previewStyle === "cover" && "object-cover",
              previewStyle === "contain" && "object-contain",
              previewStyle === "fill" && "object-fill",
            )}
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
        // If custom render function is provided, use it for each file
        if (renderPreview) {
          return (
            <div
              key={`${fileWithPreview?.originalFile?.name}-${idx}`}
              className="flex items-center gap-x-4 border-b py-2 first:mt-4 last:mb-4"
            >
              <div className="relative size-10">
                {renderPreview(fileWithPreview, previewStyle || "cover")}
              </div>
              <div className="flex shrink grow flex-col items-start truncate">
                <p
                  title={
                    fileWithPreview?.originalFile?.name ||
                    getUploadedFileName(fileWithPreview?.url || "")
                  }
                  className="max-w-full truncate text-sm"
                >
                  {fileWithPreview?.originalFile?.name ||
                    getUploadedFileName(fileWithPreview?.url || "")}
                </p>
                {fileWithPreview.errors?.length > 0 ? (
                  <p className="text-xs text-destructive">
                    {fileWithPreview.errors
                      .map((e) =>
                        e.message.startsWith("File is larger than")
                          ? `File is larger than ${formatBytes(
                              maxFileSize,
                              2,
                            )} (Size: ${formatBytes(fileWithPreview?.originalFile?.size || 0, 2)})`
                          : e.message,
                      )
                      .join(", ")}
                  </p>
                ) : !fileWithPreview?.url?.startsWith("http") ? (
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(fileWithPreview?.originalFile?.size || 0, 2)}
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
        }

        const previewUrl = fileWithPreview?.preview || fileWithPreview?.url;
        const fileName =
          fileWithPreview?.originalFile?.name ||
          getUploadedFileName(fileWithPreview?.url || "");
        const fileSize = fileWithPreview?.originalFile?.size || 0;
        const isOnCloud = fileWithPreview?.url?.startsWith("http");
        const isVideo =
          fileWithPreview?.originalFile?.type?.startsWith("video/") ||
          (fileWithPreview?.url &&
            fileWithPreview.url.match(/\.(mp4|webm|ogg|mov)($|\?)/i));

        return (
          <div
            key={`${fileWithPreview?.originalFile?.name}-${idx}`}
            className="flex items-center gap-x-4 border-b py-2 first:mt-4 last:mb-4"
          >
            {isVideo ? (
              <div className="relative">
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border bg-muted">
                  <VideoPlayerPreview
                    src={previewUrl || ""}
                    className="size-full overflow-hidden object-cover"
                    muted
                    loop
                    showPreviewButton
                  />
                </div>
                {isOnCloud && (
                  <CloudUpload className="absolute -right-2 top-0 z-10 size-3.5 rounded-full border bg-white/70 p-0.5 text-green-500" />
                )}
              </div>
            ) : fileWithPreview?.originalFile?.type?.startsWith("image/") ||
              isOnCloud ? (
              <div className="relative">
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border bg-muted">
                  <BlurImageNative
                    src={previewUrl}
                    alt={fileName}
                    className={cn(
                      "object-cover",
                      previewStyle === "contain" && "object-contain",
                      previewStyle === "fill" && "object-fill",
                    )}
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
            Drag and drop, paste or{" "}
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

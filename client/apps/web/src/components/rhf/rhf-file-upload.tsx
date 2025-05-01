import type { ChangeEvent, ReactNode } from "react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useUpload,
  type FileWithPreview,
  type TextareaAutosizeProps,
} from "@leww/ui";
import { cn } from "@leww/utils";
import { useFormContext } from "react-hook-form";

interface RHFFileUploadProps extends TextareaAutosizeProps {
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  required?: boolean;
  classNames?: {
    formItem?: string;
    label?: string;
  };
  handleChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  labelIcon?: ReactNode;
  right?: ReactNode;

  dropzoneProps?: Pick<
    UploadDropzoneProps,
    | "allowedMimeTypes"
    | "maxFileSize"
    | "maxFiles"
    | "className"
    | "transformFile"
  >;
}

interface UploadDropzoneProps {
  value: FileWithPreview[];
  onChange: (value: FileWithPreview[]) => void;
  transformFile?: (file: File) => Promise<File>;
  allowedMimeTypes: string[];
  maxFileSize: number;
  maxFiles: number;
  disabled?: boolean;
  className?: string;
}

const UploadDropzone = ({
  value,
  onChange: propOnChange,
  transformFile,
  allowedMimeTypes,
  maxFileSize,
  maxFiles,
  disabled,
  className,
}: UploadDropzoneProps) => {
  const upload = useUpload({
    value: value || [],
    defaultValue: value || [],
    onChange: (files) => {
      if (transformFile) {
        // wrap the async work so this callback returns void
        (async () => {
          try {
            const transformed = await Promise.all(
              files.map(async (fw) => {
                if (fw.url) return fw;
                const resized = await transformFile(fw.originalFile);
                return {
                  ...fw,
                  originalFile: resized,
                  preview: URL.createObjectURL(resized),
                  url: undefined,
                };
              }),
            );
            propOnChange(transformed);
          } catch (err) {
            console.error("Resize error:", err);
            // optionally pass through the original files
            propOnChange(files);
          }
        })();
      } else {
        propOnChange(files);
      }
    },
    allowedMimeTypes,
    maxFileSize,
    maxFiles,
    disabled,
  });

  return (
    <Dropzone {...upload} className={className}>
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
};

export const RHFFileUpload = ({
  name,
  label,
  description,
  required = false,
  classNames,
  labelIcon,
  right,
  disabled,
  dropzoneProps,
}: RHFFileUploadProps) => {
  const { control } = useFormContext();
  const allowedMimeTypes = dropzoneProps?.allowedMimeTypes || ["image/*"];
  const maxFileSize = dropzoneProps?.maxFileSize || 5 * 1024 * 1024; // 5MB
  const maxFiles = dropzoneProps?.maxFiles || 1;

  return (
    <FormField
      control={control as any}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(classNames?.formItem)}>
          {label && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <FormLabel
                  required={required}
                  className={cn(classNames?.label)}
                >
                  {label}
                </FormLabel>
                {labelIcon}
              </div>
              {right}
            </div>
          )}
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <UploadDropzone
              value={field.value}
              onChange={field.onChange}
              allowedMimeTypes={allowedMimeTypes}
              maxFileSize={maxFileSize}
              maxFiles={maxFiles}
              className={dropzoneProps?.className}
              disabled={disabled}
              transformFile={dropzoneProps?.transformFile}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

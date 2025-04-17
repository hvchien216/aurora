import type { ChangeEvent, ReactNode } from "react";
import { useFormContext } from "react-hook-form";

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
  type TextareaAutosizeProps,
} from "~/components/shared";
import { useUpload, type FileWithPreview } from "~/hooks";
import { cn } from "~/lib";

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
    "allowedMimeTypes" | "maxFileSize" | "maxFiles" | "className"
  >;
}

interface UploadDropzoneProps {
  value: FileWithPreview[];
  onChange: (value: FileWithPreview[]) => void;
  allowedMimeTypes: string[];
  maxFileSize: number;
  maxFiles: number;
  disabled?: boolean;
  className?: string;
}

const UploadDropzone = ({
  value,
  onChange,
  allowedMimeTypes,
  maxFileSize,
  maxFiles,
  disabled,
  className,
}: UploadDropzoneProps) => {
  const upload = useUpload({
    value: value || [],
    defaultValue: value || [],
    onChange,
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
      control={control}
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
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

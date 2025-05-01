import type { ChangeEvent, ReactNode } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  TextareaAutosize,
  type TextareaAutosizeProps,
} from "@leww/ui";
import { cn } from "@leww/utils";
import { useFormContext } from "react-hook-form";

interface RHFTextAreaProps extends TextareaAutosizeProps {
  name: string;
  placeholder?: string;
  label?: ReactNode;
  description?: ReactNode;
  required?: boolean;
  classNames?: {
    formItem?: string;
    input?: string;
    label?: string;
  };
  handleChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  labelIcon?: ReactNode;
  right?: ReactNode;
  minRows?: number;
  maxLength?: number;
  showCounter?: boolean;
}

export const RHFTextAreaAutoSize = ({
  name,
  placeholder,
  label,
  description,
  required = false,
  classNames,
  handleChange,
  labelIcon,
  right,
  minRows = 3,
  maxLength = 240,
  showCounter,
  ...props
}: RHFTextAreaProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control as any}
      name={name}
      render={({ field }) => (
        <FormItem className={classNames?.formItem}>
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
              <div className="flex items-center gap-2">
                {showCounter && (
                  <p className="text-xs text-neutral-500">
                    {field.value?.length || 0}/{maxLength}
                  </p>
                )}
                {right}
              </div>
            </div>
          )}
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <TextareaAutosize
              className={cn(classNames?.input)}
              {...props}
              placeholder={placeholder}
              {...field}
              value={field.value}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                field.onChange(e);
                handleChange?.(e);
              }}
              minRows={minRows}
              maxLength={maxLength}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

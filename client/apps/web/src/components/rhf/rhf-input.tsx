import type { ChangeEvent, ReactNode } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  type InputProps,
} from "~/components/shared";
import { cn } from "~/lib";

interface RHFInputProps extends InputProps {
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
  handleChange?: (val: string) => void;
  labelIcon?: ReactNode;
  right?: ReactNode;
}

const formatNumber = (value: string): string => {
  const [integerPart, decimalPart] = value.split(".");
  const formattedInteger = (integerPart || "").replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );
  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
};

const unformattedNumber = (value: string): string => {
  return value.replace(/,/g, "");
};

const formatNumberOnBlur = (value: string): string => {
  const [integerPart, decimalPart = ""] = value.split(".");
  let fallbackIntegerPart = integerPart;
  if (fallbackIntegerPart === "") {
    fallbackIntegerPart = "0";
  }
  const formattedInteger = (fallbackIntegerPart || "").replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );
  const formattedDecimal = decimalPart.padEnd(2, "0").slice(0, 2);
  return `${formattedInteger}.${formattedDecimal}`;
};

export const RHFInput = ({
  name,
  placeholder,
  label,
  description,
  required = false,
  classNames,
  handleChange,
  type,
  labelIcon,
  right,
  ...props
}: RHFInputProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
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
              {right}
            </div>
          )}
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <Input
              className={cn(classNames?.input)}
              {...props}
              placeholder={placeholder}
              {...field}
              value={
                type === "number" ? formatNumber(field.value) : field.value
              }
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const inputValue = e.target.value;
                if (type === "number") {
                  const numericValue = unformattedNumber(inputValue);
                  if (/^-?\d*\.?\d*$/.test(numericValue)) {
                    field.onChange(numericValue);
                    handleChange?.(numericValue);
                  }
                } else {
                  field.onChange(inputValue);
                  handleChange?.(inputValue);
                }
              }}
              onBlur={(e) => {
                if (type === "number" && e.target.value !== "") {
                  const formattedValue = formatNumberOnBlur(
                    unformattedNumber(e.target.value),
                  );
                  e.target.value = formattedValue;
                  const numericValue = unformattedNumber(formattedValue);
                  field.onChange(numericValue);
                  handleChange?.(numericValue);
                }
                field.onBlur();
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

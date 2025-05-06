"use client";

// Re-export hooks from react-hook-form to ensure single instance
export {
  useForm,
  useFormContext,
  useWatch,
  useFormState,
  useFieldArray,
  Controller,
  FormProvider,
} from "react-hook-form";

// Export other hooks if they exist
export * from "./use-mobile";
export * from "./use-toast";
export * from "./use-debounce-value";
export * from "./use-upload";
export * from "./use-controllable-state";
export * from "./use-enter-submit";
export * from "./use-data-table";
export * from "./use-copy-to-clipboard";

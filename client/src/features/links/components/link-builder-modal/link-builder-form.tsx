import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import RHFInput from "~/components/rhf/rhf-input";
import {
  Button,
  DialogClose,
  DialogFooter,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "~/components/shared";
import { createLinkSchema, type CreateLink } from "~/features/links/schemas";

type Props = {};

const LinkBuilderForm = (props: Props) => {
  // 1. Define your form.
  const form = useForm<CreateLink>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      key: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: CreateLink) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="overflow-y-auto p-3">
          <RHFInput name="key" label="Destination Link" required />
        </div>
        <DialogFooter className="bg-neutral-50 px-5 py-3 sm:items-center">
          <Button type="submit">Create Link</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default LinkBuilderForm;

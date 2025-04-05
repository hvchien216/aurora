import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLinkSchema, type CreateLink } from "~/features/links/schemas";
import { useForm } from "react-hook-form";

import { RHFInput } from "~/components/rhf";
import { Button, DialogFooter, Form, InfoTooltip } from "~/components/shared";
import { cn } from "~/lib";

import LinkPreview from "./link-preview";

type Props = {};

const LinkBuilderForm = (props: Props) => {
  // 1. Define your form.
  const form = useForm<CreateLink>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      url: "",
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
          <div
            className={cn(
              "min-h-[400px]",
              "grid w-full gap-y-6 max-md:overflow-auto md:grid-cols-[1fr_2fr]",
              // "max-md:max-h-[calc(100dvh-200px)] max-md:min-h-[min(510px,_calc(100dvh-200px))]",
              // "md:[&>div]:max-h-[calc(100dvh-200px)] md:[&>div]:min-h-[min(510px,_calc(100dvh-200px))]",
            )}
          >
            <div className="scrollbar-hide px-6 md:overflow-auto md:pl-0 md:pr-4">
              <div className="relative">
                <div className="border-primary-200 absolute inset-0 rounded-xl border bg-primary-foreground/50 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
                <div className="relative flex flex-col gap-6 p-4">
                  <LinkPreview />
                </div>
              </div>
            </div>
            <div className="scrollbar-hide px-6 md:overflow-auto">
              <div className="flex min-h-full flex-col gap-6 pb-4">
                <RHFInput
                  name="url"
                  label="Destination Link"
                  required
                  labelIcon={
                    <InfoTooltip>
                      <div className="max-w-xs px-4 py-2 text-center text-sm">
                        The URL your users will get redirected to when they
                        visit your short link.
                      </div>
                    </InfoTooltip>
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="bg-neutral-50 px-5 py-3 sm:items-center">
          <Button type="submit">Create Link</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default LinkBuilderForm;

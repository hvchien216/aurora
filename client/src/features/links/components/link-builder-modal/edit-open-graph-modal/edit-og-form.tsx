import React, { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";

import { RHFFileUpload, RHFTextAreaAutoSize } from "~/components/rhf";
import { Button, DialogFooter, Form } from "~/components/shared";
import { useEnterSubmit } from "~/hooks";
import { resizeImageToFile } from "~/utils";
import {
  OG_IMAGE_FILE_UPLOAD_CONFIGURATION,
  ogLinkFormDataSchema,
  type CreateLinkForm,
  type OGLinkFormData,
} from "~/features/links/schemas";

type Props = {
  handleClose: () => void;
};

const EditOGForm: React.FC<Props> = ({ handleClose }) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { handleKeyDown } = useEnterSubmit(formRef);

  const { getValues: getValuesParent, setValue: setValueParent } =
    useFormContext<CreateLinkForm>();
  const form = useForm<OGLinkFormData>({
    resolver: zodResolver(ogLinkFormDataSchema),
    defaultValues: {
      image: getValuesParent("image"),
      title: getValuesParent("title") || "",
      description: getValuesParent("description") || "",
      proxy: getValuesParent("proxy"),
    },
    mode: "onChange",
  });

  const onSubmit = async (values: OGLinkFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    (["image", "title", "description", "proxy"] as const).forEach((key) =>
      setValueParent(key, values[key], { shouldDirty: true }),
    );

    handleClose();
  };
  const { isDirty, isValid, isSubmitting } = form.formState;
  console.log("🚀 ~ form.formState:", form.getValues());

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.stopPropagation();
          form.handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-6"
      >
        <div className="space-y-3 p-4">
          <RHFFileUpload
            name="image"
            label="Image"
            dropzoneProps={{
              ...OG_IMAGE_FILE_UPLOAD_CONFIGURATION,
              className: "aspect-[1200/630]",
              transformFile: resizeImageToFile,
            }}
            description="Recommended: 1200 x 630 pixels"
          />
          <RHFTextAreaAutoSize
            name="title"
            label="Title"
            placeholder="Add a title..."
            maxLength={120}
            showCounter
            onKeyDown={handleKeyDown}
          />
          <RHFTextAreaAutoSize
            name="description"
            label="Description"
            placeholder="Add a description..."
            maxLength={240}
            showCounter
            onKeyDown={handleKeyDown}
          />
        </div>
        <DialogFooter className="bg-neutral-50 px-4 py-3 sm:items-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isDirty || !isValid}
            loading={isSubmitting}
          >
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EditOGForm;

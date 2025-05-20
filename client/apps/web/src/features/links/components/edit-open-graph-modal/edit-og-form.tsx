import React, { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DialogFooter,
  Form,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useEnterSubmit,
  usePromptModal,
} from "@leww/ui";
import { useForm, useFormContext } from "react-hook-form";
import { Link2, Video } from "lucide-react";

import { RHFFileUpload, RHFTextAreaAutoSize } from "~/components/rhf";
import { resizeImageToFile } from "@leww/utils";
import {
  OG_IMAGE_FILE_UPLOAD_CONFIGURATION,
  OG_VIDEO_FILE_UPLOAD_CONFIGURATION,
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
      video: getValuesParent("video"),
      title: getValuesParent("title") || "",
      description: getValuesParent("description") || "",
      proxy: getValuesParent("proxy"),
    },
    mode: "onChange",
  });

  const onSubmit = async (values: OGLinkFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    (["image", "video", "title", "description", "proxy"] as const).forEach(
      (key) => setValueParent(key, values[key], { shouldDirty: true }),
    );

    handleClose();
  };

  const {
    setShowPromptModal: setShowImagePromptModal,
    PromptModal: ImagePromptModal,
  } = usePromptModal({
    title: "Use image from URL",
    description:
      "Paste an image URL to use for your link's social media cards.",
    label: "Image URL",
    inputProps: {
      type: "url",
      placeholder: "https://example.com/og.png",
    },
    onSubmit: (url) => {
      if (!url) return;

      form.setValue("image", [{ url }], { shouldDirty: true });
    },
  });

  // const {
  //   setShowPromptModal: setShowVideoPromptModal,
  //   PromptModal: VideoPromptModal,
  // } = usePromptModal({
  //   title: "Use video from URL",
  //   description: "Paste a video URL to use for your link's social media cards.",
  //   label: "Video URL",
  //   inputProps: {
  //     type: "url",
  //     placeholder: "https://example.com/video.mp4",
  //   },
  //   onSubmit: (url) => {
  //     if (!url) return;

  //     form.setValue("video", [{ url }], { shouldDirty: true });
  //   },
  // });

  const { isDirty, isValid, isSubmitting } = form.formState;

  return (
    <>
      <ImagePromptModal />
      {/* <VideoPromptModal /> */}
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
              description="Recommended: 1200 x 630 pixels."
              right={
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-fit rounded-full p-0"
                      onClick={() => setShowImagePromptModal(true)}
                    >
                      <Link2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Paste a URL to an image
                  </TooltipContent>
                </Tooltip>
              }
            />

            {/* <RHFFileUpload
              name="video"
              label="Video"
              dropzoneProps={{
                ...OG_VIDEO_FILE_UPLOAD_CONFIGURATION,
                className: "aspect-video",
                previewStyle: "cover",
              }}
              description="Recommended: 16/9 format."
              right={
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-fit rounded-full p-0"
                      onClick={() => setShowVideoPromptModal(true)}
                    >
                      <Video className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Paste a URL to a video
                  </TooltipContent>
                </Tooltip>
              }
            /> */}

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
    </>
  );
};

export default EditOGForm;

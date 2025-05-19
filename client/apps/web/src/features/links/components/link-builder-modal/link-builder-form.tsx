import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DialogFooter,
  Form,
  InfoTooltip,
  toast,
  useCopyToClipboard,
} from "@leww/ui";
import { useForm } from "react-hook-form";

import { RHFInput } from "~/components/rhf";
import { useUploadMutation } from "~/hooks";
import { cn, getFirst, linkConstructor } from "@leww/utils";
import {
  LinkPreview,
  QRCodePreview,
  ShortenKeyInput,
} from "~/features/links/components";
import {
  useCreateLinkMutation,
  useInvalidateLinksWorkspace,
} from "~/features/links/hooks";
import {
  createLinkFormSchema,
  type CreateLinkForm,
} from "~/features/links/schemas";
import { useGeWorkSpaceBySlugQuery } from "~/features/workspaces/hooks";

type Props = {
  handleClose: () => void;
};

const LinkBuilderForm: React.FC<Props> = ({ handleClose }) => {
  const { slug } = useParams<{ slug: string }>();
  const [, copyToClipboard] = useCopyToClipboard();

  const invalidateLinksWorkspace = useInvalidateLinksWorkspace();

  const form = useForm<CreateLinkForm>({
    resolver: zodResolver(createLinkFormSchema),
    defaultValues: {
      url: "",
      image: [],
      video: null,
      proxy: false,
      title: null,
      description: null,
      workspaceId: null,
      key: "",
    },
    mode: "onChange",
  });

  const { data: ws } = useGeWorkSpaceBySlugQuery({ slug });

  useEffect(() => {
    if (ws) {
      form.setValue("workspaceId", ws.id);
    }
  }, [ws, form]);

  const { mutateAsync } = useCreateLinkMutation({
    onSuccess: async (data) => {
      handleClose();
      invalidateLinksWorkspace();

      const domain = process.env.NEXT_PUBLIC_DOMAIN;
      const shortLink = linkConstructor({
        domain,
        key: data.key,
      });
      await copyToClipboard(shortLink);
      toast.info("Copied short link to clipboard!");
    },
  });

  const { mutateAsync: uploadMutationAsync } = useUploadMutation();

  const onSubmit = async (values: CreateLinkForm) => {
    const { image, ...restValues } = values;

    const _img = getFirst(image);
    const localFile = !_img?.url ? _img?.originalFile : null;

    const mutationPromise = (async () => {
      let imgUrl = _img?.url;

      if (localFile) {
        const response = await uploadMutationAsync({
          file: localFile,
        });
        imgUrl = response.url;
      }

      return mutateAsync({
        ...restValues,
        image: imgUrl,
      });
    })();

    toast.promise(mutationPromise, {
      loading: "Creating...",
      success: "Your link has been created successfully",
      error: (err) => {
        return err.message;
      },
    });

    await mutationPromise;
  };
  const { isDirty, isValid, isSubmitting } = form.formState;

  return (
    <Form {...(form as any)}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <div className="overflow-y-auto p-3">
          <div
            className={cn(
              "min-h-[400px]",
              "grid w-full gap-y-6 max-md:overflow-auto md:grid-cols-[1fr_2fr]",
              "md:[&>div]:min-h-[min(540px,_calc(100dvh-200px))]",
              // "max-md:max-h-[calc(100dvh-200px)] max-md:min-h-[min(510px,_calc(100dvh-200px))]",
              // "md:[&>div]:max-h-[calc(100dvh-200px)] md:[&>div]:min-h-[min(510px,_calc(100dvh-200px))]",
            )}
          >
            <div className="scrollbar-hide px-6 md:overflow-auto md:pl-0 md:pr-4">
              <div className="relative">
                <div className="border-primary-200 absolute inset-0 rounded-xl border bg-primary-foreground/50 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
                <div className="relative flex flex-col gap-3 p-4">
                  <QRCodePreview />
                  <LinkPreview />
                </div>
              </div>
            </div>
            <div className="scrollbar-hide px-6 md:overflow-auto md:pl-2 md:pr-0">
              <div className="flex min-h-full flex-col gap-x-6 gap-y-4">
                <RHFInput
                  name="url"
                  label="Destination Link"
                  required
                  labelIcon={
                    <InfoTooltip>
                      <div className="max-w-xs px-2 py-2 text-center text-sm">
                        The URL your users will get redirected to when they
                        visit your short link.
                      </div>
                    </InfoTooltip>
                  }
                />
                <ShortenKeyInput />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="bg-neutral-50 px-3 py-3 sm:items-center">
          <Button
            type="submit"
            disabled={!isDirty || !isValid}
            loading={isSubmitting}
          >
            Create Link
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default LinkBuilderForm;

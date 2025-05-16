import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, InfoTooltip, toast, useForm } from "@leww/ui";

import { RHFInput } from "~/components/rhf";
import { useUploadMutation } from "~/hooks";
import { getFirst, isNil } from "@leww/utils";
import {
  LinkActionBar,
  LinkPreview,
  QRCodePreview,
  ShortenKeyInput,
} from "~/features/links/components";
import {
  useInvalidateLinkDetails,
  useUpdateLinkMutation,
} from "~/features/links/hooks";
import {
  createLinkFormSchema,
  type CreateLinkForm,
  type Link,
} from "~/features/links/schemas";

type Props = {
  link: Link;
};

const LinkForm: React.FC<Props> = ({ link }) => {
  const invalidateLinkDetails = useInvalidateLinkDetails(link.id);
  // TODO: fix Meta Tags is called causing form dirty
  const form = useForm<CreateLinkForm>({
    resolver: zodResolver(createLinkFormSchema),
    defaultValues: {
      url: link.url,
      image: isNil(link?.image)
        ? []
        : [
            {
              url: link?.image ? link.image : undefined,
            },
          ],
      video: link.video,
      proxy: link.proxy,
      title: link.title,
      description: link.description,
      workspaceId: link.workspaceId,
      key: link.key,
    },
    mode: "onChange",
  });

  const { mutateAsync } = useUpdateLinkMutation(link.id, {
    onSuccess: async (data) => {
      await invalidateLinkDetails();
      form.reset(
        {
          url: data.url,
          image: isNil(data?.image)
            ? []
            : [
                {
                  url: data?.image ? data.image : undefined,
                },
              ],
          video: data.video,
          proxy: data.proxy,
          title: data.title,
          description: data.description,
          workspaceId: data.workspaceId,
          key: data.key,
        },
        {
          keepDirty: false,
          keepIsSubmitted: false,
        },
      );
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
      loading: "Updating...",
      success: "Your link has been updated successfully",
      error: (err) => {
        return err.message;
      },
    });

    await mutationPromise;
  };

  return (
    <div className="lg:container lg:mx-auto lg:min-h-[calc(100vh-48px)] lg:p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
          <div className="relative flex min-h-full flex-col gap-8 lg:flex-row">
            {/* Main Content - Form */}
            <div className="relative flex min-h-full flex-1 flex-col px-4 lg:px-0">
              <div className="rounded-lg border bg-background p-6">
                <div className="space-y-4">
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
                  <ShortenKeyInput enableLock originalKey={link.key} />
                </div>
              </div>
              <div className="lg:grow" />
              <LinkActionBar className="hidden lg:block" />
            </div>

            {/* Right Sidebar - Previews */}
            <div className="w-full space-y-4 px-4 lg:w-[400px] lg:px-0">
              <div className="rounded-lg border bg-card p-4">
                <QRCodePreview />
              </div>
              <div className="rounded-lg border bg-card p-4">
                <LinkPreview />
              </div>
            </div>
            <LinkActionBar className="block lg:hidden" />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LinkForm;

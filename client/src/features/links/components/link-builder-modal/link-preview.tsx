"use client";

import React, { Fragment, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Earth, PenIcon } from "lucide-react";

import { Facebook, LinkedIn, XTwitter } from "~/components/shared/icons";
import {
  Button,
  InfoTooltip,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/shared";
import { useDebounceValue } from "~/hooks";
import { getDomainWithoutWWW, getFirst, getUploadedFileName } from "~/utils";
import { useGetMetaTagsQuery } from "~/features/links/hooks";
import { type CreateLinkForm } from "~/features/links/schemas";

import EditOpenGraphModal from "./edit-open-graph-modal";
import {
  DefaultOGPreview,
  FacebookOGPreview,
  ImagePreview,
  LinkedInOGPreview,
  XOGPreview,
} from "./open-graph-previews";

const tabs = [
  {
    label: "Default",
    icon: <Earth className="size-5" />,
    children: DefaultOGPreview,
    id: "default",
  },
  {
    label: "XTwitter",
    icon: <XTwitter className="size-5" />,
    children: XOGPreview,
    id: "x",
  },
  {
    label: "LinkedIn",
    icon: <LinkedIn className="size-5" />,
    children: LinkedInOGPreview,
    id: "linkedin",
  },
  {
    label: "Facebook",
    icon: <Facebook className="size-5" />,
    children: FacebookOGPreview,
    id: "facebook",
  },
];
const LinkPreview = () => {
  const { watch, setValue } = useFormContext<CreateLinkForm>();
  const [url, image, title, description] = watch([
    "url",
    "image",
    "title",
    "description",
  ]);
  const debouncedUrl = useDebounceValue(url, 450);

  const { data: metaTagData, isLoading: isGeneratingMetatag } =
    useGetMetaTagsQuery(
      { url: debouncedUrl },
      {
        enabled: debouncedUrl?.length > 0,
      },
    );

  const [openOGModal, setOpenOGModal] = React.useState(false);

  useEffect(() => {
    if (metaTagData) {
      setValue("title", metaTagData.title, { shouldDirty: true });
      setValue("description", metaTagData.description, { shouldDirty: true });
      setValue(
        "image",
        [
          {
            url: metaTagData?.image ? metaTagData.image : undefined,
          },
        ],
        { shouldDirty: true, shouldValidate: true },
      );
    }
  }, [metaTagData, setValue]);

  const host = getDomainWithoutWWW(debouncedUrl) ?? null;
  const imgUrl = getFirst(image)?.url || getFirst(image)?.preview;

  return (
    <>
      <EditOpenGraphModal open={openOGModal} setOpen={setOpenOGModal} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-foreground">
            Custom Link Preview
          </h2>
          <InfoTooltip>
            <div className="max-w-xs px-4 py-2 text-center text-sm">
              {`Customize how your links look when shared on social media to improve
          click-through rates. When enabled, the preview settings below will be
          shown publicly (instead of the URL's original metatags).`}
            </div>
          </InfoTooltip>
        </div>
      </div>
      <Tabs defaultValue="default">
        <TabsList className="h-12 w-full p-0">
          {tabs.map((tab) => (
            <Fragment key={tab.id}>
              <Tooltip>
                <TooltipTrigger asChild autoFocus={false}>
                  <div className="flex h-full w-full flex-1 items-center justify-center">
                    <TabsTrigger className="px-5 py-2" value={tab.id}>
                      {tab.icon}
                    </TabsTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-xs">
                  {tab.label}
                </TooltipContent>
              </Tooltip>
            </Fragment>
          ))}
        </TabsList>
        {tabs.map((tab) => {
          const OGPreview = tab.children;
          return (
            <TabsContent key={tab.id} value={tab.id}>
              <div className="relative">
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-2 z-10 h-8 w-fit px-1.5"
                      onClick={() => setOpenOGModal(true)}
                      disabled={isGeneratingMetatag}
                    >
                      <PenIcon className="mx-px size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Open the Edit Open Graph Modal
                  </TooltipContent>
                </Tooltip>

                <OGPreview
                  title={title}
                  description={description}
                  hostname={host}
                >
                  <ImagePreview
                    image={imgUrl || null}
                    isGeneratingMetatag={isGeneratingMetatag}
                  />
                </OGPreview>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </>
  );
};

export default LinkPreview;

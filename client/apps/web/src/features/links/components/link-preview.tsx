"use client";

import React, { Fragment, useEffect } from "react";
import {
  Button,
  InfoTooltip,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useDebounceValue,
  useFormContext,
} from "@leww/ui";
import { Facebook, LinkedIn, XTwitter } from "@leww/ui/icons";
import { Earth, Eye, EyeClosed, PenIcon } from "lucide-react";

import { getDomainWithoutWWW, getFirst, isNil, truncate } from "@leww/utils";
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

export const LinkPreview = () => {
  const { watch, setValue, setError, clearErrors } =
    useFormContext<CreateLinkForm>();
  const [url, image, title, description, proxy] = watch([
    "url",
    "image",
    "title",
    "description",
    "proxy",
  ]);
  const debouncedUrl = useDebounceValue(url, 450);

  const { data: metaTagData, isLoading: isGeneratingMetatag } =
    useGetMetaTagsQuery(
      { url: debouncedUrl },
      {
        enabled: debouncedUrl?.length > 0,
        staleTime: 0,
        gcTime: 0,
      },
    );

  useEffect(() => {
    if (isGeneratingMetatag) {
      // just a tricky to prevent the form from being submitted
      setError("image", { message: "Generating metatags..." });
    } else {
      clearErrors("image");
    }
  }, [isGeneratingMetatag, clearErrors, setError]);

  const [openOGModal, setOpenOGModal] = React.useState(false);

  useEffect(() => {
    // if proxy is enabled, don't update the meta tags
    if (proxy) return;

    if (metaTagData) {
      const truncatedTitle = truncate(metaTagData.title, 120);
      const truncatedDescription = truncate(metaTagData.description, 240);
      if (truncatedTitle !== title) {
        setValue("title", truncatedTitle, { shouldDirty: true });
      }
      if (truncatedDescription !== description) {
        setValue("description", truncatedDescription, { shouldDirty: true });
      }

      if (getFirst(image)?.url !== metaTagData?.image) {
        const imageValue = isNil(metaTagData?.image)
          ? []
          : [
              {
                url: metaTagData?.image ? metaTagData.image : undefined,
              },
            ];
        setValue("image", imageValue, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
  }, [metaTagData, setValue, proxy]);

  const host = getDomainWithoutWWW(debouncedUrl) ?? null;
  const imgUrl = getFirst(image)?.url || getFirst(image)?.preview;

  return (
    <>
      <EditOpenGraphModal open={openOGModal} setOpen={setOpenOGModal} />
      <div className="mb-3 flex items-center justify-between">
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
        <ProxySwitch />
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
                      disabled={isGeneratingMetatag || !proxy}
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

const ProxySwitch = () => {
  const { setValue, watch } = useFormContext<CreateLinkForm>();
  const [proxyChecked, url] = watch(["proxy", "url"]);

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <div className="relative inline-grid h-5 grid-cols-[1fr_1fr] items-center text-sm font-medium">
          <Switch
            checked={proxyChecked}
            onCheckedChange={(checked) =>
              setValue("proxy", checked, { shouldDirty: true })
            }
            className="[&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] peer absolute inset-0 h-[inherit] w-auto data-[state=unchecked]:bg-input/50 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
          />
          <span className="ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center transition-transform duration-300 peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
            <EyeClosed size={14} aria-hidden="true" />
          </span>
          <span className="ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center transition-transform duration-300 peer-data-[state=unchecked]:invisible peer-data-[state=checked]:-translate-x-full peer-data-[state=checked]:text-background peer-data-[state=checked]:rtl:translate-x-full">
            <Eye size={14} aria-hidden="true" />
          </span>
        </div>
      </TooltipTrigger>
      {!url && (
        <TooltipContent side="top">
          Enter a URL to enable custom link previews.
        </TooltipContent>
      )}

      {url && proxyChecked && (
        <TooltipContent side="top">
          Custom link previews are enabled.
        </TooltipContent>
      )}
      {url && !proxyChecked && (
        <TooltipContent side="top">
          Custom link previews are turned off.
        </TooltipContent>
      )}
    </Tooltip>
  );
};

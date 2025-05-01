import { useMemo, type PropsWithChildren } from "react";
import { ShimmerDots, useIsMobile } from "@leww/ui";
import { cn } from "@leww/utils";
import { useFormContext } from "react-hook-form";
import ReactTextareaAutosize from "react-textarea-autosize";
import { Image, LoaderCircle } from "lucide-react";

import { type CreateLink } from "~/features/links/schemas";

type OGPreviewProps = PropsWithChildren<{
  title: string | null;
  description: string | null;
  hostname: string | null;
}>;

const DefaultOGPreview: React.FC<OGPreviewProps> = ({
  title,
  description,
  children,
}) => {
  const { setValue } = useFormContext<CreateLink>();

  return (
    <div>
      <div className="group relative overflow-hidden rounded-md border border-neutral-300">
        {children}
      </div>
      <ReactTextareaAutosize
        className="mt-4 line-clamp-2 w-full resize-none border-none p-0 text-xs font-medium text-neutral-700 outline-none focus:ring-0"
        value={title || "Add a title..."}
        maxRows={2}
        onChange={(e) => {
          setValue("title", e.currentTarget.value, { shouldDirty: true });
        }}
      />
      <ReactTextareaAutosize
        className="mt-1.5 line-clamp-2 w-full resize-none border-none p-0 text-xs text-neutral-700/80 outline-none focus:ring-0"
        value={description || "Add a description..."}
        maxRows={2}
        onChange={(e) => {
          setValue("description", e.currentTarget.value, {
            shouldDirty: true,
          });
        }}
      />
    </div>
  );
};

const FacebookOGPreview: React.FC<OGPreviewProps> = ({
  title,
  description,
  hostname,
  children,
}) => {
  const { setValue } = useFormContext<CreateLink>();

  return (
    <div>
      <div className="relative border border-neutral-300">
        {children}
        {(hostname || title || description) && (
          <div className="grid gap-1 border-t border-neutral-300 bg-[#f2f3f5] p-2">
            {hostname && (
              <p className="text-xs uppercase text-[#606770]">{hostname}</p>
            )}
            <input
              className="truncate border-none bg-transparent p-0 text-xs font-semibold text-[#1d2129] outline-none focus:ring-0"
              value={title || "Add a title..."}
              onChange={(e) => {
                setValue("title", e.currentTarget.value, {
                  shouldDirty: true,
                });
              }}
            />
            <ReactTextareaAutosize
              className="mb-1 line-clamp-2 w-full resize-none rounded-md border-none bg-neutral-200 p-0 text-xs text-[#606770] outline-none focus:ring-0"
              value={description || "Add a description..."}
              maxRows={2}
              onChange={(e) => {
                setValue("description", e.currentTarget.value, {
                  shouldDirty: true,
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const LinkedInOGPreview: React.FC<OGPreviewProps> = ({
  title,
  hostname,
  children,
}) => {
  const { setValue } = useFormContext<CreateLink>();

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#8c8c8c33] px-4 py-3">
      <div
        className="relative w-32 shrink-0 overflow-hidden rounded-lg"
        style={{ "--aspect": "128/72" } as any}
      >
        {children}
      </div>
      <div className="grid gap-2">
        <ReactTextareaAutosize
          className="line-clamp-2 w-full resize-none border-none p-0 text-sm font-semibold text-[#000000E6] outline-none focus:ring-0"
          value={title || "Add a title..."}
          maxRows={2}
          onChange={(e) => {
            setValue("title", e.currentTarget.value, {
              shouldDirty: true,
            });
          }}
        />
        <p className="text-xs text-[#00000099]">{hostname || "domain.com"}</p>
      </div>
    </div>
  );
};

const XOGPreview: React.FC<OGPreviewProps> = ({
  title,
  hostname,
  children,
}) => {
  return (
    <div>
      <div className="group relative overflow-hidden rounded-2xl border border-neutral-300">
        {children}
        <div className="absolute bottom-2 left-0 w-full px-2">
          <div className="w-fit max-w-full rounded bg-black/[0.77] px-1.5 py-px">
            <span className="block max-w-sm truncate text-xs text-white">
              {title || "Add a title..."}
            </span>
          </div>
        </div>
      </div>
      {hostname && (
        <p className="mt-1 text-xs text-[#606770]">From {hostname}</p>
      )}
    </div>
  );
};

const ImagePreview = ({
  image,
  isGeneratingMetatag,
}: {
  image: string | null;
  isGeneratingMetatag?: boolean;
}) => {
  const isMobile = useIsMobile();

  const previewImage = useMemo(() => {
    if (isGeneratingMetatag) {
      return (
        <div className="flex aspect-[var(--aspect,1200/630)] w-full flex-col items-center justify-center bg-neutral-100">
          <LoaderCircle className="size-4 animate-spin" />
        </div>
      );
    }
    if (image) {
      return (
        <div className="relative isolate flex aspect-[1200/630] w-full flex-col items-center justify-center overflow-hidden rounded-md border border-neutral-300 bg-white shadow-sm transition-all hover:bg-neutral-50">
          <img
            src={image}
            alt="Preview"
            className={cn("h-full w-full rounded-[inherit] object-cover")}
          />
        </div>
      );
    } else {
      return (
        <div className="relative aspect-[var(--aspect,1200/630)] w-full bg-white">
          {!isMobile && (
            <ShimmerDots className="pointer-events-none opacity-30 [mask-image:radial-gradient(40%_80%,transparent_50%,black)]" />
          )}
          <div className="pointer-events-none relative flex size-full flex-col items-center justify-center gap-2">
            <Image className="size-5 text-neutral-700" />
            <p className="max-w-32 text-center text-xs text-neutral-700">
              Enter a link to generate a preview
            </p>
          </div>
        </div>
      );
    }
  }, [image, isGeneratingMetatag, isMobile]);

  return <>{previewImage}</>;
};

export {
  DefaultOGPreview,
  FacebookOGPreview,
  LinkedInOGPreview,
  XOGPreview,
  ImagePreview,
};

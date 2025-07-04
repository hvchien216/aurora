import { ImageProps } from "next/image";
import { Globe } from "lucide-react";
import { cn, GOOGLE_FAVICON_URL } from "@leww/utils";

import { BlurImage } from "./blur-image";

export function LinkLogo({
  apexDomain,
  className,
  imageProps,
}: {
  apexDomain?: string | null;
  className?: string;
  imageProps?: Partial<ImageProps>;
}) {
  return apexDomain ? (
    <BlurImage
      src={`${GOOGLE_FAVICON_URL}${apexDomain}`}
      alt={apexDomain}
      className={cn("h-8 w-8 rounded-full sm:h-10 sm:w-10", className)}
      width={20}
      height={20}
      draggable={false}
      {...imageProps}
    />
  ) : (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 px-0 sm:h-10 sm:w-10",
        className,
      )}
    >
      <Globe className="h-4 w-4 text-neutral-600 sm:h-5 sm:w-5" />
    </div>
  );
}

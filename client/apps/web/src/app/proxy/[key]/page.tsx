import { notFound, redirect } from "next/navigation";
import { getApexDomain, tryCatch } from "@leww/utils";
import { unescape } from "html-escaper";

import { BlurImage, BlurImageNative } from "~/components/shared/blur-image";
import { httpRequest } from "~/lib";
import { metadataConstructor } from "~/utils";
import { GOOGLE_FAVICON_URL } from "~/constants";
import { type Link } from "~/features/links";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;

  const { data, error } = await tryCatch<Link>(
    httpRequest.get(`/v1/links/key/${decodeURIComponent(key)}`, {
      auth: false,
    }),
  );

  if (error) {
    return;
  }

  if (!data?.proxy) {
    return;
  }

  const apexDomain = getApexDomain(data.url);

  return metadataConstructor({
    title: unescape(data.title || ""),
    description: unescape(data.description || ""),
    image: data.image,
    video: data.video,
    icons: `${GOOGLE_FAVICON_URL}${apexDomain}`,
    noIndex: true,
  });
}

export default async function ProxyPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;

  const { data, error } = await tryCatch<Link>(
    httpRequest.get(`/v1/links/key/${decodeURIComponent(key)}`, {
      auth: false,
    }),
  );

  if (error) {
    return notFound();
  }

  // if the link doesn't exist
  if (!data) {
    return notFound();

    // if the link does not have proxy enabled, redirect to the original URL
  } else if (!data?.proxy) {
    redirect(data.url);
  }

  const apexDomain = getApexDomain(data.url);

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="mx-5 w-full max-w-lg overflow-hidden rounded-lg border border-neutral-200 sm:mx-0">
        <BlurImageNative
          src={data.image || ""}
          alt={unescape(data.title || "")}
          className="w-full object-cover"
        />
        <div className="flex space-x-3 bg-neutral-100 p-5">
          <BlurImage
            width={20}
            height={20}
            src={`${GOOGLE_FAVICON_URL}${apexDomain}`}
            alt={unescape(data.title || "")}
            className="mt-1 size-6"
          />
          <div className="flex flex-col space-y-3">
            <h1 className="font-bold text-neutral-700">
              {unescape(data.title || "")}
            </h1>
            <p className="text-sm text-neutral-500">
              {unescape(data.description || "")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

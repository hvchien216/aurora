"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@leww/ui";

import { locations } from "~/constants";
import { useGetLinkById } from "~/features/links/hooks";

import LinkForm from "./link-form";

const LinkDetails = () => {
  const { id: linkId, slug } = useParams<{ slug: string; id: string }>();
  const router = useRouter();

  // TODO: auto redirect to links page if link is not found
  const { data: link, error } = useGetLinkById(linkId, {
    enabled: !!linkId,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (error?.getStatusCode() === 404) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Link Not Found</h1>
          <p className="text-sm text-gray-500">
            The link you are looking for does not exist.
          </p>
          <Button
            className="mt-2"
            onClick={() => router.push(locations.links(slug))}
          >
            Go to links
          </Button>
        </div>
      </div>
    );
  }
  // TODO: add skeleton loading
  return link ? <LinkForm link={link} /> : null;
};

export default LinkDetails;

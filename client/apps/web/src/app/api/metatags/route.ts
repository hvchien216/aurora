import { NextRequest, NextResponse } from "next/server";
import { getMetaTagsSchema } from "~/features/links";

import { getMetaTags } from "./utils";

export const runtime = "edge";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

// TODO: move logic to back-end
export async function GET(req: NextRequest) {
  try {
    const { url } = getMetaTagsSchema.parse({
      url: req.nextUrl.searchParams.get("url"),
    });

    const metatags = await getMetaTags(url);
    return NextResponse.json(
      {
        ...metatags,
        poweredBy: "Lew | Aurora",
      },
      {
        headers: CORS_HEADERS,
      },
    );
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

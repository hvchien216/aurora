import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { nanoid, tryCatch } from "@leww/utils";

import { extractUrl, httpRequest } from "~/lib";
import { type Link } from "~/features/links";

import { type CustomMiddleware } from "./chain";
import {
  addClickIdCookie,
  detectBot,
  getClientIp,
  isAuthRoute,
  isPrivateRoute,
  isPublicRoute,
} from "./utils";

export function withLink(middleware: CustomMiddleware) {
  return async (req: NextRequest, ev: NextFetchEvent, res: NextResponse) => {
    const { path, key, fullKey: originalKey } = extractUrl(req);

    // empty string is home page
    if (key === "") {
      return NextResponse.rewrite(new URL(`/`, req.url));
    }

    if (isPublicRoute(path) || isAuthRoute(path) || isPrivateRoute(path)) {
      return middleware(req, ev, res);
    }
    const cookieStore = await cookies();
    let clickId = cookieStore.get("click_id")?.value;
    if (!clickId) {
      clickId = nanoid(16);
    }

    const isBot = detectBot(req);
    const ip = getClientIp(req);
    console.log("🚀 ~ return ~ isBot:", isBot, "------", key);
    console.log("🚀 ~ return ~ ip:", ip, "------", key);

    const { data, error } = await tryCatch<Link>(
      httpRequest.post(
        `/v1/links/click`,
        { key, clickId, isBot, ip },
        { auth: false },
      ),
    );

    if (error) {
      return NextResponse.redirect(new URL(`/`, req.url));
    }

    // TODO: add new column `expiredUrl` & `expiresAt` then redirect to expiredUrl
    // or redirect to Expired page

    if (isBot && data.proxy) {
      return addClickIdCookie(
        NextResponse.rewrite(
          new URL(`/proxy/${encodeURIComponent(key)}`, req.url),
        ),
        { clickId, path: `/${originalKey}` },
      );
    }

    return addClickIdCookie(NextResponse.redirect(new URL(data.url, req.url)), {
      clickId,
      path: `/${originalKey}`,
    });
  };
}

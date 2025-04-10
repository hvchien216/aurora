import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

import { extractUrl, httpRequest, nanoid } from "~/lib";
import { tryCatch } from "~/utils";
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
    const { domain, path, key, fullKey: originalKey } = extractUrl(req);

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

    const { data, error } = await tryCatch<Link>(
      httpRequest.post(`/v1/links/click`, { domain, key, clickId, isBot, ip }),
    );

    if (error) {
      return NextResponse.redirect(new URL(`/`, req.url));
    }

    // TODO: add new column `expiredUrl` & `expiresAt` then redirect to expiredUrl
    // or redirect to Expired page

    return addClickIdCookie(NextResponse.redirect(new URL(data.url, req.url)), {
      clickId,
      path: `/${originalKey}`,
    });
  };
}

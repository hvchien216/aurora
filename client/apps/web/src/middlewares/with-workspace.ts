import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  isAuthRoute,
  isPrivateRoute,
  isPublicRoute,
} from "~/middlewares/utils";

import { extractUrl, httpRequest } from "~/lib";
import { type User } from "~/features/user/schemas";
import { type Workspace } from "~/features/workspaces";

import { type CustomMiddleware } from "./chain";

export function withWorkspace(middleware: CustomMiddleware) {
  return async (req: NextRequest, ev: NextFetchEvent, res: NextResponse) => {
    const { path } = extractUrl(req);

    // Chỉ xử lý với các route bắt đầu bằng /w
    if (isPublicRoute(path)) {
      return middleware(req, ev, res);
    }

    if (isAuthRoute(path) || isPrivateRoute(path)) {
      // TODO: create Profile type
      const [workspacesResult, profileResult] = await Promise.allSettled([
        httpRequest.get<Workspace[]>("/v1/workspaces"),
        httpRequest.get<User>("/v1/profile", { cache: "default" }),
      ]);

      const workspaces =
        workspacesResult.status === "fulfilled" ? workspacesResult.value : null;

      const profile =
        profileResult.status === "fulfilled" ? profileResult.value : null;

      if (!workspaces && !profile) {
        // TODO: redirect to another page,
        // now, temporary redirect to home page
        return NextResponse.redirect(new URL(`/`, req.url));
      }

      // for now, logic ensure that user has at least one workspace when they register
      const defaultWorkspace = profile?.defaultWorkspace as string;
      const memberWorkspaces = (workspaces || []).map((w) => w.slug);

      // Phân tích URL dạng /w hoặc /w/:workspaceId(/subpath...)
      const match = path.match(/^\/w(?:\/([^\/]+))?(\/.*)?$/);
      const requestedWorkspaceId = match ? match[1] : undefined;

      // if (!requestedWorkspaceId) {
      //   // Nếu người dùng chỉ truy cập /w (không có workspaceId) thì redirect về default workspace
      //   if (defaultWorkspace) {
      //     return NextResponse.rewrite(
      //       new URL(`/w/${defaultWorkspace}`, req.url),
      //     );
      //   } else if (memberWorkspaces.length > 0) {
      //     return NextResponse.redirect(
      //       new URL(`/w/${memberWorkspaces[0]}`, req.url),
      //     );
      //   }
      // } else if (requestedWorkspaceId !== defaultWorkspace) {
      //   // Nếu workspace không phải default, kiểm tra xem user có phải thành viên của workspace đó không
      //   if (memberWorkspaces.includes(requestedWorkspaceId)) {
      //     // Nếu không phải thành viên, chuyển hướng về default workspace
      //     return NextResponse.rewrite(
      //       new URL(`/w/${requestedWorkspaceId}`, req.url),
      //     );
      //   } else {
      //     return NextResponse.redirect(
      //       new URL(`/w/${defaultWorkspace}`, req.url),
      //     );
      //   }
      // }
      if (!requestedWorkspaceId) {
        return redirectToWorkspace(
          req,
          defaultWorkspace || memberWorkspaces[0],
        );
      }

      if (!memberWorkspaces.includes(requestedWorkspaceId)) {
        return redirectToWorkspace(req, defaultWorkspace);
      }

      // TODO: need to check 404 route
      return middleware(req, ev, res);
    }
    // Nếu thỏa mãn, cho phép tiếp tục xử lý request
    return middleware(req, ev, res);
  };
}

const redirectToWorkspace = (req: NextRequest, workspaceId?: string) => {
  if (workspaceId) {
    return NextResponse.redirect(new URL(`/w/${workspaceId}`, req.url));
  }
  return NextResponse.redirect(new URL(`/`, req.url));
};

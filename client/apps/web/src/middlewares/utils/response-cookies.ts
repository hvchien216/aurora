import { type NextResponse } from "next/server";

export function addClickIdCookie(
  res: NextResponse,
  { clickId, path }: { clickId: string; path: string },
): NextResponse {
  res.cookies.set("click_id", clickId, {
    path,
    maxAge: 60 * 60, // 1 hour
  });

  return res;
}

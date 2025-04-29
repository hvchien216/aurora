import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  // TODO: call logout API to clear tokens

  return NextResponse.json({ success: true });
}

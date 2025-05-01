import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { authCallbackSchema } from "~/features/auth/schemas";
import { jwtDecode } from "jwt-decode";

import { type TokenPayload } from "~/types";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, refreshToken } = authCallbackSchema.parse(
      await req.json(),
    );

    // Decode tokens to extract exp field
    const decodedAccessToken = jwtDecode<TokenPayload>(accessToken);
    const decodedRefreshToken = jwtDecode<TokenPayload>(refreshToken);

    if (!decodedAccessToken?.exp || !decodedRefreshToken?.exp) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const accessTokenExpiresAt = new Date(decodedAccessToken.exp * 1000);
    const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp * 1000);

    console.log(
      "process.env.NODE_ENV === ",
      process.env.NODE_ENV === "production",
    );

    const cookieStore = await cookies();
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: accessTokenExpiresAt,
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: refreshTokenExpiresAt,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error?.message }, { status: 400 });
  }
}

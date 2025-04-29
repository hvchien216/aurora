import { type NextRequest } from "next/server";

const LOCALHOST_IP = "113.161.65.9"; // fallback IP for local dev, just a random ip
const IP_HEADER_KEYS = ["x-forwarded-for", "x-real-ip", "cf-connecting-ip"];

export function getClientIp(req: NextRequest): string {
  for (const key of IP_HEADER_KEYS) {
    const ip = req.headers.get(key);
    if (ip?.length) {
      const parsedIp = ip.split(",")?.[0]?.trim() as string;
      return parsedIp === "::1" ? LOCALHOST_IP : parsedIp;
    }
  }

  return LOCALHOST_IP;
}

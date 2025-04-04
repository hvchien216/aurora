import { type NextRequest } from "next/server";

export const extractUrl = (req: NextRequest) => {
  let domain = req.headers.get("host") as string;
  // remove www. from domain and convert to lowercase
  domain = domain.replace(/^www./, "").toLowerCase();

  // path is the path of the URL (e.g. example.com/stats/github -> /stats/github)
  const path = req.nextUrl.pathname;

  // fullPath is the full URL path (along with search params)
  const searchParams = req.nextUrl.searchParams.toString();
  const searchParamsString = searchParams.length > 0 ? `?${searchParams}` : "";
  const fullPath = `${path}${searchParamsString}`;

  const key = decodeURIComponent(path.split("/")?.[1] || ""); // key is the first part of the path (e.g. example.com/stats/github -> stats)
  const fullKey = decodeURIComponent(path.slice(1)); // fullKey is the full path without the first slash (to account for multi-level subpaths, e.g. example.com/github/repo -> github/repo)

  return { domain, path, fullPath, key, fullKey, searchParamsString };
};

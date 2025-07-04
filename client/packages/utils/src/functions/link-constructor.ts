import { punycode } from "../lib";

export function linkConstructor({
  domain,
  key,
  pretty,
  searchParams,
}: {
  domain?: string;
  key?: string;
  pretty?: boolean;
  searchParams?: Record<string, string>;
}) {
  if (!domain) {
    return "";
  }

  const protocol = process.env.NODE_ENV !== "development" ? "https" : "http";

  let url = `${protocol}://${punycode(domain)}${key ? `/${punycode(key)}` : ""}`;

  if (searchParams) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      search.set(key, value);
    }
    url += `?${search.toString()}`;
  }

  return pretty ? url.replace(/^https?:\/\//, "") : url;
}

export function linkConstructorSimple({
  domain,
  key,
}: {
  domain: string;
  key: string;
}) {
  const protocol = process.env.NODE_ENV !== "development" ? "https" : "http";

  return `${protocol}://${domain}${`/${key}`}`;
}

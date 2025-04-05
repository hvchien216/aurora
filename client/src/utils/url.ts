import { isNil } from "./is-nil";

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const getDomainWithoutWWW = (url: string) => {
  if (isValidUrl(url)) {
    return new URL(url).hostname.replace(/^www\./, "");
  }
  try {
    if (url.includes(".") && !url.includes(" ")) {
      return new URL(`https://${url}`).hostname.replace(/^www\./, "");
    }
  } catch (e) {
    return null;
  }
};

function addParams(location: string, qs: string | null = null) {
  if (qs) {
    const questionMarkPosition = location.indexOf("?");
    if (questionMarkPosition === -1) {
      location += "?" + qs;
    } else if (questionMarkPosition === location.length - 1) {
      location += qs;
    } else {
      location += "&" + qs;
    }
  }

  return location;
}

export function injectParams(
  location: string,
  keys: { [key: string]: string } = {},
  options?: { [key: string]: any },
) {
  if (!options) {
    return addParams(location);
  }

  let url: URL | undefined;
  if (typeof window !== "undefined") {
    url = new URL(window.location.href);
  }
  const currentParams: URLSearchParams | undefined =
    typeof window !== "undefined" ? url?.searchParams : undefined;

  const params: string[] = [];

  for (const [key, param] of Object.entries(keys)) {
    const value = !isNil(options[key])
      ? options[key]
      : currentParams?.get(param);

    switch (typeof value) {
      case "string":
        params.push(`${param}=${value}`);
        break;
      case "number":
        if (!Number.isFinite(value)) {
          params.push(`${param}=${value}`);
        }
        break;
      default:
      // ignore
    }
  }

  return addParams(location, params.join("&"));
}

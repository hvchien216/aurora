import { isNil } from "./is-nil";

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
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
        params.push(`${param}=${value}`);
        break;
      default:
      // ignore
    }
  }

  return addParams(location, params.join("&"));
}

export function getValue<V>(
  value: string | number | null | undefined,
  defaultValue?: V,
) {
  return !isNil(value)
    ? typeof value === "string" && value == ""
      ? value
      : value
    : defaultValue;
}

export function getPage(
  value: string | number | null | undefined,
  defaultValue = 1,
) {
  if (!value) {
    return defaultValue;
  }

  if (typeof value === "string") {
    value = Number(value);
  }

  if (Number.isNaN(value)) {
    return defaultValue;
  }

  return Math.max(defaultValue, value);
}

export function getSortBy<V extends string>(
  value: string | null | undefined,
  values: V[],
  defaultValue: V | undefined,
) {
  if (values.includes(value as any)) {
    return value as V;
  }

  return defaultValue;
}

export const getPrettyUrl = (url?: string | null) => {
  if (!url) return "";
  // remove protocol (http/https) and www.
  // also remove trailing slash
  return url
    .replace(/(^\w+:|^)\/\//, "")
    .replace("www.", "")
    .replace(/\/$/, "");
};

export const PUBLIC_ROUTE_PATTERNS = [/^\/$/, /^\/proxy(\/.*)?$/];

export const AUTH_ROUTE_PATTERNS = [
  /^\/login$/,
  /^\/register$/,
  /^\/auth\/callback\/google$/,
];
// e.g /w/lewis, /account/settings
export const PRIVATE_ROUTE_PATTERNS = [/^\/w(\/.*)?$/, /^\/account(\/.*)?$/];

export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTE_PATTERNS.some((pattern) => pattern.test(path));
}

export function isAuthRoute(path: string): boolean {
  return AUTH_ROUTE_PATTERNS.some((pattern) => pattern.test(path));
}

export function isPrivateRoute(path: string): boolean {
  return PRIVATE_ROUTE_PATTERNS.some((pattern) => pattern.test(path));
}

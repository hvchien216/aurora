import { chain, withAuth, withLink, withWorkspace } from "~/middlewares";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (proxies for third-party services)
     * 4. Metadata files: favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest
     */
    "/((?!api/|_next/|_proxy/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|mp4|webm|ogg|mp3|wav|flac|m4a)).*)",
  ],
};

export default chain([withLink, withAuth, withWorkspace]);

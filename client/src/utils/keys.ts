export const isReservedKey = (key: string) => {
  const staticFiles = [
    "favicon.ico",
    "sitemap.xml",
    "robots.txt",
    "manifest.webmanifest",
    "manifest.json",
    "apple-app-site-association",
  ];

  return staticFiles.includes(key);
};

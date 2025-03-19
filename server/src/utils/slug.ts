export function generateSlug(name: string): string {
  // Convert to lowercase and replace spaces with dashes
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${baseSlug}`;
}

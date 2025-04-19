export function getUploadedFileName(input: string): string {
  if (typeof input !== "string" || input.trim() === "") {
    return "unknown";
  }

  const parts = input.trim().split("/");
  const filename = parts[parts.length - 1];

  return filename || "unknown";
}

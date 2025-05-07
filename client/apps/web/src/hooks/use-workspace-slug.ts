import { usePathname } from "next/navigation";

export const useWorkspaceSlug = () => {
  const pathname = usePathname();

  // Match the URL pattern to extract the workspace slug
  const match = pathname.match(/^\/w(?:\/([^\/]+))?(\/.*)?$/);
  const workspaceSlug = match ? match[1] : undefined;

  return workspaceSlug;
};

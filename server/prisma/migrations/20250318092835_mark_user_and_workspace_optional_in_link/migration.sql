-- DropForeignKey
ALTER TABLE "links" DROP CONSTRAINT "links_user_id_fkey";

-- DropForeignKey
ALTER TABLE "links" DROP CONSTRAINT "links_workspace_id_fkey";

-- AlterTable
ALTER TABLE "links" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "workspace_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

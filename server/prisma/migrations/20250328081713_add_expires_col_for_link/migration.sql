-- AlterTable
ALTER TABLE "links" ADD COLUMN     "expired_url" TEXT,
ADD COLUMN     "expires_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "album_suggestions" ADD COLUMN     "adminResponse" TEXT,
ADD COLUMN     "respondedAt" TIMESTAMP(3),
ADD COLUMN     "respondedBy" TEXT;

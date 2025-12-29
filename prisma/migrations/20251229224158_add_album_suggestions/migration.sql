-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ADDED');

-- CreateTable
CREATE TABLE "album_suggestions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "albumTitle" TEXT NOT NULL,
    "mbid" TEXT,
    "coverUrl" TEXT,
    "year" INTEGER,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "album_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "album_suggestions_status_idx" ON "album_suggestions"("status");

-- CreateIndex
CREATE INDEX "album_suggestions_artistName_idx" ON "album_suggestions"("artistName");

-- CreateIndex
CREATE UNIQUE INDEX "album_suggestions_userId_artistName_albumTitle_key" ON "album_suggestions"("userId", "artistName", "albumTitle");

-- AddForeignKey
ALTER TABLE "album_suggestions" ADD CONSTRAINT "album_suggestions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

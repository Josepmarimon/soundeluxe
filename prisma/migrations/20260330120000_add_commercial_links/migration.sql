-- CreateEnum
CREATE TYPE "CommercialLinkStatus" AS ENUM ('PENDING', 'SENT', 'OPENED', 'CONVERTED');

-- CreateTable
CREATE TABLE "commercial_links" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientCompany" TEXT,
    "status" "CommercialLinkStatus" NOT NULL DEFAULT 'PENDING',
    "firstOpenedAt" TIMESTAMP(3),
    "lastOpenedAt" TIMESTAMP(3),
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "lang" "Language" NOT NULL DEFAULT 'CA',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "commercial_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial_link_visits" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeOnPageSeconds" INTEGER,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceType" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "country" TEXT,
    "city" TEXT,
    "scrollDepthPercent" INTEGER,
    "sectionsViewed" TEXT[],

    CONSTRAINT "commercial_link_visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commercial_links_token_key" ON "commercial_links"("token");
CREATE INDEX "commercial_links_status_idx" ON "commercial_links"("status");
CREATE INDEX "commercial_links_recipientEmail_idx" ON "commercial_links"("recipientEmail");
CREATE INDEX "commercial_links_deletedAt_idx" ON "commercial_links"("deletedAt");

-- CreateIndex
CREATE INDEX "commercial_link_visits_linkId_idx" ON "commercial_link_visits"("linkId");
CREATE INDEX "commercial_link_visits_visitedAt_idx" ON "commercial_link_visits"("visitedAt");

-- AddForeignKey
ALTER TABLE "commercial_link_visits" ADD CONSTRAINT "commercial_link_visits_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "commercial_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

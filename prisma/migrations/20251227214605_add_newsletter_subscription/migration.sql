-- AlterTable
ALTER TABLE "users" ADD COLUMN     "newsletterConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "newsletterSubscribed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'CA',
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "unsubscribeToken" TEXT NOT NULL,
    "unsubscribedAt" TIMESTAMP(3),
    "consentedAt" TIMESTAMP(3),
    "consentIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_confirmToken_key" ON "subscribers"("confirmToken");

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_unsubscribeToken_key" ON "subscribers"("unsubscribeToken");

-- CreateIndex
CREATE INDEX "subscribers_email_idx" ON "subscribers"("email");

-- CreateIndex
CREATE INDEX "subscribers_confirmToken_idx" ON "subscribers"("confirmToken");

-- CreateIndex
CREATE INDEX "subscribers_unsubscribeToken_idx" ON "subscribers"("unsubscribeToken");

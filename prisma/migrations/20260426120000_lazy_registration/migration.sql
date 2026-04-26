-- Lazy registration via guest checkout
-- Make password nullable (null = guest user pendent d'establir contrasenya via magic link)
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;

-- Magic link token to set password from BookingConfirmation email
ALTER TABLE "users" ADD COLUMN "passwordSetupToken" TEXT;
ALTER TABLE "users" ADD COLUMN "passwordSetupTokenExpiry" TIMESTAMP(3);

CREATE UNIQUE INDEX "users_passwordSetupToken_key" ON "users"("passwordSetupToken");

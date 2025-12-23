-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('VISITOR', 'REGISTERED', 'PREMIUM', 'EDITOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('CA', 'ES', 'EN');

-- CreateEnum
CREATE TYPE "ReservaStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'BIZUM');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'PARTIAL', 'FULL', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'REGISTERED',
    "language" "Language" NOT NULL DEFAULT 'CA',
    "photoUrl" TEXT,
    "emailVerified" TIMESTAMP(3),
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "premiumUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "numPlaces" INTEGER NOT NULL DEFAULT 1,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "status" "ReservaStatus" NOT NULL DEFAULT 'CONFIRMED',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "stripePaymentId" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "refundAmount" DECIMAL(10,2),
    "refundStatus" "RefundStatus",
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "attendedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votaciones" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ressenyes" (
    "id" TEXT NOT NULL,
    "reservaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "moderated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ressenyes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comentaris" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "moderated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comentaris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "llista_espera" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "llista_espera_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "reservas_stripePaymentId_key" ON "reservas"("stripePaymentId");

-- CreateIndex
CREATE INDEX "reservas_userId_idx" ON "reservas"("userId");

-- CreateIndex
CREATE INDEX "reservas_sessionId_idx" ON "reservas"("sessionId");

-- CreateIndex
CREATE INDEX "reservas_status_idx" ON "reservas"("status");

-- CreateIndex
CREATE INDEX "votaciones_albumId_idx" ON "votaciones"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "votaciones_userId_albumId_key" ON "votaciones"("userId", "albumId");

-- CreateIndex
CREATE UNIQUE INDEX "ressenyes_reservaId_key" ON "ressenyes"("reservaId");

-- CreateIndex
CREATE INDEX "ressenyes_sessionId_idx" ON "ressenyes"("sessionId");

-- CreateIndex
CREATE INDEX "ressenyes_userId_idx" ON "ressenyes"("userId");

-- CreateIndex
CREATE INDEX "comentaris_albumId_idx" ON "comentaris"("albumId");

-- CreateIndex
CREATE INDEX "comentaris_userId_idx" ON "comentaris"("userId");

-- CreateIndex
CREATE INDEX "llista_espera_sessionId_notified_idx" ON "llista_espera"("sessionId", "notified");

-- CreateIndex
CREATE UNIQUE INDEX "llista_espera_userId_sessionId_key" ON "llista_espera"("userId", "sessionId");

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votaciones" ADD CONSTRAINT "votaciones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ressenyes" ADD CONSTRAINT "ressenyes_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ressenyes" ADD CONSTRAINT "ressenyes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentaris" ADD CONSTRAINT "comentaris_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "llista_espera" ADD CONSTRAINT "llista_espera_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

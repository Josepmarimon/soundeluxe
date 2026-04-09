-- AlterTable: Add invoiceNumber with autoincrement sequence
CREATE SEQUENCE IF NOT EXISTS "reservas_invoiceNumber_seq";

ALTER TABLE "reservas" ADD COLUMN "invoiceNumber" INTEGER UNIQUE DEFAULT nextval('"reservas_invoiceNumber_seq"');

ALTER SEQUENCE "reservas_invoiceNumber_seq" OWNED BY "reservas"."invoiceNumber";

-- Backfill existing records with sequential numbers based on creation date
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt") as rn
  FROM "reservas"
  WHERE "invoiceNumber" IS NULL
)
UPDATE "reservas" SET "invoiceNumber" = numbered.rn
FROM numbered
WHERE "reservas".id = numbered.id;

-- Update the sequence to start after the last used number
SELECT setval('"reservas_invoiceNumber_seq"', COALESCE((SELECT MAX("invoiceNumber") FROM "reservas"), 0) + 1, false);

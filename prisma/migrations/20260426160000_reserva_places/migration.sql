-- Una entrada individual per a cada plaça comprada (per fer check-in granular).
CREATE TABLE "reserva_places" (
    "id" TEXT NOT NULL,
    "reservaId" TEXT NOT NULL,
    "placeNumber" INTEGER NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "attendedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reserva_places_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "reserva_places_reservaId_placeNumber_key"
  ON "reserva_places"("reservaId", "placeNumber");

CREATE INDEX "reserva_places_reservaId_idx"
  ON "reserva_places"("reservaId");

ALTER TABLE "reserva_places" ADD CONSTRAINT "reserva_places_reservaId_fkey"
  FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: per cada Reserva CONFIRMED existent, crear N rows ReservaPlace.
-- Si la reserva ja era 'attended', totes les places s'hereten com a attended.
INSERT INTO "reserva_places" ("id", "reservaId", "placeNumber", "attended", "attendedAt", "createdAt")
SELECT
  gen_random_uuid()::text,
  r."id",
  gs.place_number,
  r."attended",
  CASE WHEN r."attended" THEN r."attendedAt" ELSE NULL END,
  r."createdAt"
FROM "reservas" r
CROSS JOIN LATERAL generate_series(1, r."numPlaces") AS gs(place_number)
WHERE r."status" = 'CONFIRMED';

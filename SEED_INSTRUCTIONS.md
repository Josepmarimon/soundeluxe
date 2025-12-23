# Instruccions per executar el Seed Script

Aquest script poblarà Sanity amb 25 àlbums històrics i les seves sessions programades per dissabtes d'hivern i primavera 2026.

## Pas 1: Obtenir un Token de Sanity

1. Ves a https://www.sanity.io/manage
2. Selecciona el teu projecte "Sound Deluxe"
3. A la barra lateral, fes clic a "API"
4. A la secció "Tokens", fes clic a "Add API token"
5. Dona-li un nom (per exemple: "Seed Script")
6. Selecciona permisos: **Editor** (necessari per crear continguts)
7. Copia el token generat

## Pas 2: Configurar les variables d'entorn

Afegeix el token al teu fitxer `.env.local`:

```bash
SANITY_API_TOKEN=skXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Pas 3: Executar el script

```bash
npm run seed
```

El script farà el següent:
- Crearà una sala per defecte (Sala Sound Deluxe Barcelona)
- Crearà un tipus de sessió estàndard
- Descarregarà 25 caràtules d'àlbums icònics de Wikimedia Commons
- Crearà 25 àlbums amb tota la informació
- Generarà 25 sessions programades per dissabtes de gener a juny 2026
- Assignarà preus entre 25€ i 45€ per sessió

## Àlbums que es crearan

Els 25 àlbums més importants de la història amb varietat de gèneres:

- **Rock**: Pink Floyd, The Beatles, Nirvana, Led Zeppelin, U2, Radiohead...
- **Jazz**: Miles Davis, John Coltrane
- **Pop**: Michael Jackson, Prince, Joni Mitchell
- **Soul**: Marvin Gaye, Amy Winehouse, Stevie Wonder
- **Hip-Hop**: Lauryn Hill
- **Electrònica**: Daft Punk

## Calendari de sessions

Les sessions es programaran cada dissabte des del **3 de gener de 2026** fins al **20 de juny de 2026** (hivern i primavera).

## Neteja (si cal)

Si vols netejar les dades i tornar a començar:

1. Ves a Sanity Studio (http://localhost:3000/studio)
2. Elimina manualment els documents creats
3. O utilitza la consola de Sanity:

```bash
npx sanity dataset delete production
npx sanity dataset create production
```

## Troubleshooting

- **Error de permisos**: Assegura't que el token té permisos d'Editor
- **Error descarregant imatges**: Algunes imatges de Wikimedia poden fallar temporalment. El script continuarà sense la imatge.
- **Error de connexió**: Verifica que les variables d'entorn estan ben configurades

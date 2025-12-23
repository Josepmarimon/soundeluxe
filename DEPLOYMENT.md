# Deployment a Vercel

Aquest document descriu els passos per desplegar Sound Deluxe a Vercel.

## Variables d'entorn requerides

Has de configurar les següents variables d'entorn a Vercel:

### 1. Base de dades (Neon Postgres)

```
DATABASE_URL=postgresql://neondb_owner:PASSWORD@HOST/neondb?sslmode=require
```

**On trobar-ho:**
- Ve de la teva base de dades Neon Postgres
- Pots copiar-ho des de `.env.local` si tens el projecte configurat localment

### 2. Sanity CMS

```
NEXT_PUBLIC_SANITY_PROJECT_ID=k94gdbik
NEXT_PUBLIC_SANITY_DATASET=production
```

**On trobar-ho:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID` és l'ID del teu projecte Sanity
- Pots trobar-ho a https://sanity.io/manage o a `sanity/env.ts`

### 3. NextAuth

```
NEXTAUTH_URL=https://el-teu-domini.vercel.app
NEXTAUTH_SECRET=un-secret-aleatori-molt-llarg-minim-32-caracters
```

**Com generar-ho:**
- `NEXTAUTH_URL`: URL del teu deployment a Vercel
- `NEXTAUTH_SECRET`: Pots generar-ne un amb:
  ```bash
  openssl rand -base64 32
  ```

## Com afegir variables d'entorn a Vercel

### Opció 1: Des del Dashboard de Vercel

1. Ves a https://vercel.com/dashboard
2. Selecciona el teu projecte `soundeluxe`
3. Ves a **Settings** → **Environment Variables**
4. Afegeix cada variable amb el seu valor
5. Assegura't de seleccionar els environments: **Production**, **Preview**, **Development**
6. Fes clic a **Save**
7. Fes un nou deployment (redeploy) perquè les variables tinguin efecte

### Opció 2: Des de la CLI de Vercel

```bash
# Afegir variables una per una
vercel env add DATABASE_URL production
vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production
vercel env add NEXT_PUBLIC_SANITY_DATASET production
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production

# Fer redeploy
vercel --prod
```

## Verificació

Després de configurar les variables:

1. El deployment hauria de completar-se amb èxit
2. Verifica que pots accedir a: `https://el-teu-domini.vercel.app`
3. Comprova que:
   - La pàgina principal carrega correctament
   - El Studio de Sanity funciona a `/studio`
   - Pots registrar-te i iniciar sessió

## Troubleshooting

### Error: Missing environment variable

Si veus aquest error, revisa que totes les variables estiguin configurades correctament a Vercel i fes un redeploy.

### Database connection errors

Verifica que:
- La URL de Neon Postgres és correcta
- La base de dades accepta connexions des de Vercel
- El `sslmode=require` està inclòs a la URL

### NextAuth errors

Verifica que:
- `NEXTAUTH_URL` apunta al domini correcte de Vercel
- `NEXTAUTH_SECRET` té almenys 32 caràcters

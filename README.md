# Sound Deluxe 🎵

Plataforma de sessions d'escolta immersiva en sales equipades amb sistemes Hi-Fi d'altíssima gamma.

## 🎯 Concepte

Sound Deluxe ofereix experiències d'escolta d'àlbums complets amb la màxima qualitat sonora possible en sales amb equips McIntosh, Bowers & Wilkins, Mark Levinson i Focal.

- **Sessions d'escolta immersiva** amb vinilos originals i edicions audiophile
- **Comunitat de melòmans** amb sistema de votacions i ressenyes
- **Reserves online** amb pagament segur (Stripe + Bizum)
- **Multiidioma**: Català, Espanyol, Anglès

## 🏗️ Stack Tecnològic

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **CMS**: Sanity.io (gestió d'àlbums i contingut)
- **Base de dades**: Vercel Postgres + Prisma (usuaris, reserves, pagaments)
- **Autenticació**: NextAuth.js amb roles
- **Pagaments**: Stripe (targeta + Bizum)
- **Emails**: Resend + React Email
- **Hosting**: Vercel (regió EU)

## 📁 Estructura del Projecte

```
sounddeluxe/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Rutes multiidioma
│   └── api/               # API Routes
├── components/            # Components React
├── lib/                   # Utilitats i clients
├── prisma/                # Schema de base de dades
├── studio/                # Sanity CMS
├── messages/              # Traduccions (ca/es/en)
├── docs/                  # Prototip HTML original
└── public/                # Assets estàtics
```

## 🚀 Desenvolupament

```bash
# Instal·lar dependències
npm install

# Executar en mode desenvolupament
npm run dev

# Build de producció
npm run build

# Executar Sanity Studio
npm run studio
```

## 📖 Documentació

- [Concepte Audiophile](./CONCEPTO-AUDIOPHILE.md) - Visió i proposta de valor
- [Prototip HTML](./docs/) - Disseny original estàtic

## 🌍 URLs

- **Producció**: TBD
- **GitHub**: https://github.com/Josepmarimon/soundeluxe
- **Sanity Studio**: TBD

## 📝 Roadmap

### Fase 1: MVP (En curs)
- [x] Setup inicial Next.js
- [ ] Migració del disseny a components React
- [ ] Configuració Sanity CMS
- [ ] Schema de base de dades (Prisma)
- [ ] Sistema d'autenticació
- [ ] Flux de reserves i pagaments

### Fase 2: Funcionalitats Essencials
- [ ] Sistema de votacions d'àlbums
- [ ] Ressenyes i valoracions
- [ ] Llista d'espera
- [ ] Emails automàtics
- [ ] Panel d'administració

### Fase 3: Escalat
- [ ] Membres premium
- [ ] Descomptes i codis promocionals
- [ ] Sistema d'affiliats
- [ ] Widget embeddable
- [ ] Botiga online

## 🔐 Variables d'Entorn

Crear fitxer `.env.local`:

```env
# Database
DATABASE_URL=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
SANITY_API_TOKEN=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=
```

## 📄 Llicència

Propietat de Sound Deluxe. Tots els drets reservats.

---

**Sound Deluxe** - La música com mai l'havies sentit 🎵

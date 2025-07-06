# EklFounder v2 - Fintech Comparison Platform

Une plateforme de comparaison et d'onboarding pour les institutions fintech (EMIs, banques, PSP, etc.), inspirée de Neolista.com.

## Stack Technique

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend/API**: API Routes dans `/app/api/`, Prisma ORM
- **Base de données**: PostgreSQL
- **Authentification**: NextAuth.js (admin par email uniquement)
- **Multilingue**: next-i18next (EN → FR)
- **Emailing**: Resend API pour notifications post-formulaires
- **Déploiement**: Vercel (frontend) + Railway (DB/API)

## Installation

1. Cloner le projet
```bash
git clone <repository-url>
cd eklfounder-v2
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env.local
# Modifier les valeurs dans .env.local
```

4. Configurer la base de données
```bash
npx prisma generate
npx prisma db push
```

5. Démarrer le serveur de développement
```bash
npm run dev
```

## Fonctionnalités

- ✅ **Page d'accueil** - Hero section avec CTA
- ✅ **Page /directory** - Recherche + filtres dynamiques
- ✅ **Pages individuelles** - Détails complets des institutions
- ✅ **Comparateur** - Sélection et comparaison côte-à-côte
- ✅ **Formulaire d'onboarding** - Multi-step form avec validation
- ✅ **Espace Admin** - CRUD des institutions + suivi des demandes
- ✅ **Blog/Guides** - Section blog multilingue
- ✅ **SEO & Tracking** - Meta balises dynamiques + Analytics
- ✅ **Multilingue** - Support EN/FR avec next-i18next

## Structure du projet

```
eklfounder-v2/
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API Routes
│   ├── (pages)/           # Pages groupées
│   └── globals.css        # Styles globaux
├── components/            # Composants React
├── lib/                   # Utilitaires et configurations
├── prisma/               # Schema et migrations Prisma
├── public/               # Assets statiques
└── types/                # Types TypeScript
```

## Scripts disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Build de production
- `npm run start` - Démarrer le serveur de production
- `npm run lint` - Linter ESLint
- `npm run db:push` - Pousser le schema Prisma vers la DB
- `npm run db:generate` - Générer le client Prisma
- `npm run db:studio` - Ouvrir Prisma Studio
- `npm run db:migrate` - Créer une nouvelle migration
- `npm run type-check` - Vérification des types TypeScript

## Déploiement

1. **Frontend (Vercel)**:
   - Connecter le repository GitHub
   - Configurer les variables d'environnement
   - Déployer automatiquement

2. **Base de données (Railway)**:
   - Créer une instance PostgreSQL
   - Configurer DATABASE_URL
   - Exécuter les migrations

## Licence

MIT 

# Maylo 2.0 (React + Vite + TS + Tailwind + Zustand + React Query + Supabase)

Modern scaffold for Maylo 2.0. This repo is ready to run locally and deploy to Vercel.

## Stack
- React + Vite + TypeScript
- React Router
- @tanstack/react-query
- Zustand (UI state)
- TailwindCSS
- Supabase (DB/Auth/Storage)
- i18next (i18n)
- PWA: manifest + service worker (Workbox-ready)

## Quickstart
```bash
npm i
npm run dev
```

## Environment
Create `.env` with:
```
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

## Where to put assets
- App icons: `public/icons/` (PNG: 192, 512)
- Maylo illustrations / images: `src/assets/` (put your existing PNG/SVG here)
  - Example references in code: `import mayloLogo from '@/assets/maylo/maylo-logo.png'`
  - Popular/empty-state images can go under `src/assets/illustrations/`

## Commands
```bash
npm run dev       # local dev
npm run build     # production build
npm run preview   # preview build
```

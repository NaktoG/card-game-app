# Deployment

## GitHub Pages

El proyecto se publica con GitHub Actions desde la rama `main`.

## Configuración Vite

Como GitHub Pages publica bajo subruta del repositorio, `vite.config.ts` define:

```ts
base: '/card-game-app/';
```

## Workflow

El workflow `.github/workflows/ci.yml` usa Node 24 y ejecuta:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test`
5. `npm run build`
6. Upload de `dist`
7. Deploy a GitHub Pages en push a `main`

## Activación En GitHub

1. Ir a Settings → Pages.
2. Source: GitHub Actions.
3. Hacer push a `main`.
4. Verificar deploy en Actions.

## PWA En GitHub Pages

Los assets PWA viven en `public/` y se publican automáticamente dentro de `dist/`.

Archivos relevantes:

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/offline.html`
- `public/pwa-icon.svg`

El service worker usa scope `/card-game-app/`, alineado con la subruta de GitHub Pages.

# Deployment

## Vercel

Production URL:

```txt
https://card-game-app.vercel.app
```

Configuración en Vercel:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` |
| Node.js | 18.x |

### Notas Vercel

- `vite.config.ts` usa `base: "/"` para Vercel (raíz del dominio).
- Los paths PWA (`manifest.webmanifest`, `sw.js`) apuntan a `/` en lugar de `/card-game-app/`.
- El service worker calcula el scope dinámicamente desde `self.registration.scope`.

## GitHub Pages

El proyecto se publica con GitHub Actions desde la rama `main`.

## Configuración Vite (GitHub Pages)

Para GitHub Pages, `vite.config.ts` debe cambiarse a:

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

## PWA

Los assets PWA viven en `public/` y se publican automáticamente dentro de `dist/`.

Archivos relevantes:

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/offline.html`
- `public/pwa-icon.svg`

En Vercel, el service worker usa scope `/` (raíz). En GitHub Pages, usa `/card-game-app/`.

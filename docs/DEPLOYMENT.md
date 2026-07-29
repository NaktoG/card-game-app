# Deployment

## Vercel

Production URL:

```txt
https://card-game-app-lyart.vercel.app
```

Operational caveat: `https://card-game-app.vercel.app` is a stale/legacy URL that serves an older CRA/Blackjack app. Do not treat it as the current production deployment.

Configuración en Vercel:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` |
| Node.js | 20 o superior; CI usa 24 |

### Notas Vercel

- `vite.config.ts` usa `base: './'` para mantener el build compatible con Vercel y con hosts estáticos bajo subruta.
- Los paths PWA (`manifest.webmanifest`, iconos, metadata y `sw.js`) se mantienen relativos para evitar URLs root-relative frágiles.
- La app normaliza `import.meta.env.BASE_URL` a `./` cuando Vite entrega `/`, y registra el service worker con path/scope relativos.

## GitHub Pages

El workflow de GitHub Pages existe, pero el deploy principal actual es Vercel. En pull requests y ramas que no sean `main`, el job de GitHub Pages se saltea.

## Configuración Vite

No cambiar `base: './'` sin validar también manifest, metadata, service worker y build generado. Esa base relativa es el contrato actual para mantener la PWA segura tanto en raíz como en subruta.

## Workflow

El workflow `.github/workflows/ci.yml` usa Node 24 y ejecuta:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test`
5. `npm run build`
6. Upload de `dist`
7. Deploy a GitHub Pages solo cuando aplique según rama/evento

## Activación en GitHub Pages

Solo aplica si se decide usar GitHub Pages como destino de publicación:

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

La PWA usa rutas relativas para manifest, iconos, metadata y service worker. Si se cambia la estrategia de publicación, validar con:

```bash
npm test -- --run src/shared/pwaAssets.test.ts
npm run build
```

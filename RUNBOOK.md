# Runbook

Guía operativa mínima para mantener **Card Game App** en desarrollo y producción.

## Producción

- Hosting principal: Vercel
- Hosting secundario: GitHub Pages, si el workflow lo publica desde `main`
- Rama de deploy: `main`
- Build command: `npm run build`
- Publish directory: `dist`
- URL principal: `https://card-game-app.vercel.app`
- URL alternativa Vercel: `https://card-game-app-lyart.vercel.app`
- URL GitHub Pages: `https://naktog.github.io/card-game-app/`
- Contrato PWA: `vite.config.ts` usa `base: './'`; manifest, metadata, iconos y service worker usan rutas relativas.

## Deploy

1. Crear cambios en una rama `feature/*`, `fix/*` o `chore/*`.
2. Ejecutar validaciones locales:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

3. Abrir PR hacia `main`, o usar PRs encadenados cuando el cambio supere el presupuesto de review.
4. Merge a `main`.
5. Vercel despliega producción desde `main`; GitHub Actions valida y publica GitHub Pages cuando aplique.

## Health Checks Manuales

- Abrir la URL de producción principal y verificar home.
- Registrar nickname y entrar al juego.
- Crear mazo nuevo.
- Robar cartas al menos tres veces.
- Verificar feedback de ganador de mano.
- Finalizar partida o simular ranking local.
- Cambiar idioma ES/EN.
- Activar/desactivar sonido.
- Instalar como PWA si el navegador ofrece la opción.
- Probar fallback offline cerrando la conexión después de una primera carga.
- Revisar responsive en móvil y desktop.

## Errores Comunes

### Pantalla en blanco o assets 404

Acciones:

1. Confirmar que `vite.config.ts` mantenga `base: './'`.
2. Ejecutar `npm test -- --run src/shared/pwaAssets.test.ts`.
3. Ejecutar `npm run build` y revisar que `dist/index.html` use rutas relativas para assets/manifest/iconos.
4. Si falla GitHub Pages, revisar que Pages apunte a GitHub Actions.
5. Abrir DevTools y revisar errores 404 de assets.

### No se cargan cartas

Acciones:

1. Revisar conexión a internet.
2. Verificar disponibilidad de `deckofcardsapi.com`.
3. Reintentar con nueva partida.

### Ranking vacío

El ranking es local. Si el navegador borra datos o se usa otro dispositivo, empieza vacío.

### Cambios visuales no aparecen

Puede existir caché del service worker.

Acciones:

1. Recargar con hard refresh.
2. En DevTools → Application → Service Workers → Unregister.
3. Cerrar y abrir nuevamente la PWA instalada.

## Rollback

Desde Git:

```bash
git revert <commit>
git push origin main
```

Desde Vercel:

1. Abrir el proyecto en Vercel.
2. Ir a Deployments.
3. Restaurar el último deployment estable.

Desde GitHub Pages:

1. Revisar el historial de Actions.
2. Revertir el commit problemático.
3. Esperar nuevo deploy automático.

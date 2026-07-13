# Runbook

Guía operativa mínima para mantener **Card Game App** en desarrollo y producción.

## Producción

- Hosting: GitHub Pages
- Rama de deploy: `main`
- Build command: `npm run build`
- Publish directory: `dist`
- URL esperada: `https://naktog.github.io/card-game-app/`

## Deploy

1. Crear cambios en una rama `feature/*`, `fix/*` o `chore/*`.
2. Ejecutar validaciones locales:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

3. Abrir PR hacia `develop` o `main` según el flujo activo.
4. Merge a `main`.
5. GitHub Actions publica `dist` en GitHub Pages.

## Health Checks Manuales

- Abrir `/card-game-app/` y verificar home.
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

### Pantalla en blanco en GitHub Pages

Acciones:

1. Confirmar que `vite.config.ts` tenga `base: '/card-game-app/'`.
2. Revisar que GitHub Pages apunte a GitHub Actions.
3. Abrir DevTools y revisar errores 404 de assets.

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

Desde GitHub Pages:

1. Revisar el historial de Actions.
2. Revertir el commit problemático.
3. Esperar nuevo deploy automático.

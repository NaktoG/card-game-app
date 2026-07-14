# Auditoría de despliegue en Vercel

## Framework

React 19 con Vite, TypeScript estricto, Zustand, Framer Motion, Howler e i18next.

## Versión de Node.js

El proyecto no declara `engines` en `package.json`. La documentación del proyecto indica Node.js 18.20 o superior y npm 10 o superior.

## Gestor de paquetes

npm con `package-lock.json` versionado.

## Comando de instalación

```bash
npm ci
```

## Comando de build

```bash
npm run build
```

El script ejecuta `tsc -b && vite build`.

## Carpeta de salida

```txt
dist
```

## Variables de entorno

No se detectaron variables de entorno requeridas para build o runtime. El uso de `import.meta.env.DEV` se limita a evitar registrar el service worker durante desarrollo local.

## Servicios externos

La aplicación consume Deck of Cards API desde el navegador para crear mazos y robar cartas. No utiliza backend propio.

## APIs

| Proveedor | Uso | Clave | Exposición | Riesgo |
|---|---|---:|---|---|
| Deck of Cards API | Juego de cartas | No | Navegador | Disponibilidad, CORS y rate limit externo |

## Base de datos

No utiliza base de datos. El ranking y las preferencias se guardan en `localStorage`.

## Adaptadores actuales

No utiliza adaptadores de despliegue. Vite genera una salida estática en `dist`.

## Riesgos

- Las rutas PWA estaban fijadas a `/card-game-app/` para GitHub Pages y fueron ajustadas para Vercel en raíz.
- El service worker puede servir contenido cacheado si un navegador conserva una versión previa; validar con hard refresh o limpiando storage durante QA.
- La API externa de cartas puede fallar, responder lento o aplicar límites.
- El ranking local no se sincroniza entre dispositivos.

## Decisión: compatible / compatible con cambios / no compatible

Compatible con cambios menores para publicar en Vercel desde raíz.

<div align="center">

# Card Game App

### Modern animated card battle built with React, Vite and Framer Motion

**Repositorio:** [github.com/NaktoG/card-game-app](https://github.com/NaktoG/card-game-app)

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animated-0055FF)](https://motion.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://card-game-app.vercel.app)

</div>

---

## Descripción

**Card Game App** es una reconstrucción completa y moderna de una app de cartas. El jugador se registra con un nickname, compite contra la CPU, acumula cartas ganadas y aparece en un ranking local persistido en el navegador.

La experiencia está diseñada como una arena visual dark-first con animaciones, sonido, i18n español/inglés y layout responsive para móvil, tablet y escritorio.

## Características

| Funcionalidad   | Descripción                                                       |
| --------------- | ----------------------------------------------------------------- |
| Registro simple | Nickname local sin backend ni contraseña                          |
| Juego de cartas | Consumo de Deck of Cards API para crear mazo y robar cartas       |
| Ranking local   | Persistencia con `localStorage` por navegador/dispositivo         |
| Animaciones     | Framer Motion para páginas, cartas, mazo, feedback y modal final  |
| Sonido          | Efectos generados en cliente con Howler.js                        |
| i18n            | Español e inglés con `i18next` y persistencia de idioma           |
| Responsive      | Mobile-first, adaptable a resoluciones pequeñas y grandes         |
| Accesibilidad   | Semántica, foco visible, labels, modal accesible y reduced motion |
| PWA             | Manifest, service worker, iconos SVG y fallback offline           |
| SEO social      | Open Graph, Twitter Card e imagen SVG de preview                  |
| Footer          | Enlace visible al repositorio GitHub desde todas las pantallas    |
| Testing         | Tests unitarios para lógica crítica del dominio                   |
| CI/CD           | GitHub Actions con lint, typecheck, tests, build y deploy a Pages |

## Demo

**Vercel:** [card-game-app.vercel.app](https://card-game-app.vercel.app)

**GitHub Pages:** [naktog.github.io/card-game-app](https://naktog.github.io/card-game-app/)

## Stack Tecnológico

| Capa          | Tecnología                       |
| ------------- | -------------------------------- |
| Framework UI  | React                            |
| Bundler       | Vite                             |
| Lenguaje      | TypeScript strict                |
| Estilos       | Tailwind CSS + CSS custom styles |
| Animaciones   | Framer Motion                    |
| Estado global | Zustand                          |
| i18n          | i18next + react-i18next          |
| Sonido        | Howler.js                        |
| Tests         | Vitest + Testing Library + Playwright |
| Calidad       | ESLint + Prettier                |
| Hosting       | Vercel                             |

## Instalación

### Requisitos Previos

- Node.js 18.20 o superior
- npm 10 o superior

### Desarrollo Local

```bash
git clone https://github.com/NaktoG/card-game-app.git
cd card-game-app
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173/card-game-app/`.

## Scripts

| Comando                | Descripción                     |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Servidor local de desarrollo    |
| `npm run build`        | Typecheck + build de producción |
| `npm run preview`      | Previsualizar build local       |
| `npm run typecheck`    | Validación TypeScript estricta  |
| `npm run lint`         | Linting con ESLint              |
| `npm run format`       | Formatear con Prettier          |
| `npm run format:check` | Verificar formato               |
| `npm test`             | Ejecutar tests unitarios        |
| `npm run test:e2e`     | Ejecutar smoke tests E2E en Chromium contra `vite preview` |
| `npm run test:e2e:install` | Instalar navegador/deps de Playwright para Chromium |
| `npm run test:watch`   | Tests en modo watch             |

## Estructura

```txt
src/
├── app/                    # Shell principal y navegación
├── features/
│   ├── game/               # Juego, dominio, componentes y API
│   ├── home/               # Registro por nickname
│   ├── ranking/            # Ranking local persistido
│   └── settings/           # Preferencias de usuario
├── shared/
│   ├── audio/              # Sound manager
│   ├── components/         # UI reutilizable
│   ├── i18n/               # Traducciones ES/EN
│   └── storage/            # Helpers de storage
├── styles/                 # Estilos globales
└── main.tsx                # Entrada React
```

## Arquitectura

La app usa una arquitectura modular orientada a features. La lógica del juego vive en `features/game/domain` y no depende de React, DOM ni servicios externos. Esto permite testear reglas de negocio de forma rápida y determinista.

Principios aplicados:

- Dominio separado de UI.
- Estado global mínimo.
- Ranking local encapsulado en store.
- API externa aislada en servicio.
- Componentes presentacionales pequeños.
- Tests sobre reglas críticas.

Ver más en [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Ranking Local

El ranking se guarda en `localStorage`. Esto implica:

- No se comparte entre dispositivos.
- No existe ranking global real.
- Se pierde si el usuario limpia los datos del navegador.
- Puede migrarse más adelante a Supabase, Firebase o backend propio.

## PWA

La app puede instalarse en dispositivos compatibles:

- Manifest: `public/manifest.webmanifest`
- Service worker: `public/sw.js`
- Fallback offline: `public/offline.html`
- Icono: `public/pwa-icon.svg`

El service worker cachea el shell de la app y assets estáticos. No cachea la API de cartas para evitar datos obsoletos.

## Testing

La validación local recomendada es:

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

Los smoke tests E2E viven en `e2e/`, usan Playwright con Chromium y mockean la API de cartas para mantener el flujo de juego determinístico.

## Deploy En Vercel

El proyecto está preparado para despliegue en Vercel como SPA estática.

Configuración:

```txt
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm ci
```

Ver detalles en [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).

## Deploy En GitHub Pages

El proyecto está preparado para publicarse como static site en GitHub Pages. Vite usa:

```ts
base: '/card-game-app/';
```

El deploy automático se ejecuta desde GitHub Actions al hacer push a `main`.

## Contribución

Flujo recomendado:

```bash
git checkout -b feature/nombre-corto
npm run lint
npm run typecheck
npm test
npm run build
```

Commits con Conventional Commits:

```txt
feat(game): add animated card arena
fix(ranking): sort entries by best score
docs(readme): document local ranking limitations
```

Ver [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Licencia

MIT. Ver [`LICENSE`](./LICENSE).

---

<div align="center">

Hecho por [NaktoG](https://github.com/NaktoG)

</div>

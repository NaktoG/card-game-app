# Architecture

## Estilo

La aplicación usa un monolito frontend modular por features. Es una SPA estática, sin backend propio y desplegable en GitHub Pages.

## Límites Principales

| Módulo                     | Responsabilidad                            |
| -------------------------- | ------------------------------------------ |
| `app`                      | Shell, navegación y composición de páginas |
| `features/home`            | Registro de nickname                       |
| `features/game/domain`     | Reglas puras del juego                     |
| `features/game/services`   | Adaptador HTTP para Deck of Cards API      |
| `features/game/components` | UI específica del juego                    |
| `features/ranking`         | Ranking local y persistencia               |
| `features/settings`        | Preferencias locales                       |
| `shared`                   | UI, i18n, audio y utilidades reutilizables |

## Decisiones

### Dominio Sin React

Las reglas viven en funciones puras para que puedan probarse sin DOM, red ni renderizado.

### Ranking Local

Se usa `localStorage` porque no hay base de datos. La UI queda preparada para migrar más adelante a un repositorio remoto si se agrega backend.

### GitHub Pages

La app es client-side y estática, por lo que GitHub Pages cubre el caso sin coste adicional.

## Trade-offs

- No hay ranking global real.
- No hay autenticación real.
- La API externa es dependencia runtime.
- El sonido depende de permiso/comportamiento del navegador.

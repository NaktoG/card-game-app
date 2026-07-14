# Despliegue en Vercel

## Proyecto

`card-game-app`

## Estado

- [x] Preview desplegada
- [x] Producción desplegada
- [x] Variables configuradas
- [ ] Dominio configurado
- [x] Pruebas completadas

## Configuración

| Campo | Valor |
|---|---|
| Framework | Vite |
| Root Directory | `./` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js | 18.20 o superior |
| Gestor de paquetes | npm |

## URL de Producción

```txt
https://card-game-app-lyart.vercel.app
```

## Variables de entorno

No se requieren variables de entorno para el despliegue actual.

## Servicios externos

La app consume Deck of Cards API directamente desde el navegador. No se configuran secretos ni endpoints server-side.

## Pruebas realizadas

Comandos ejecutados localmente:

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

Resultado: instalación, lint, typecheck, tests unitarios y build completados correctamente.

## Limitaciones

- El ranking y las preferencias son locales al navegador.
- La disponibilidad de partidas depende de Deck of Cards API.
- No se configura dominio propio en esta etapa.

## Rollback

Revertir la Pull Request de migración. Si se necesitara volver a GitHub Pages bajo subruta, restaurar `base: '/card-game-app/'` y las rutas PWA asociadas.

Para rollback desde CLI:

```bash
vercel rollback
```

## Última revisión

2026-07-14

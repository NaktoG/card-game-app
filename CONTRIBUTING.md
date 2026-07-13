# Contributing

## Flujo De Ramas

- `main`: producción estable y deployable.
- `develop`: integración previa a producción.
- `feature/*`: nuevas funcionalidades.
- `fix/*`: correcciones.
- `chore/*`: tooling, documentación o mantenimiento.

## Commits

Usar Conventional Commits en inglés:

```txt
feat(game): implement card battle domain
fix(ui): improve mobile navigation spacing
test(game): cover tie pot resolution
docs(readme): add deploy instructions
```

## Checklist Antes De PR

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] UI revisada en móvil y desktop
- [ ] Textos añadidos en español e inglés si aplica

## Criterios De Calidad

- TypeScript strict sin `any` innecesario.
- Lógica de dominio testeable sin React.
- Componentes accesibles por defecto.
- Estado global mínimo y justificado.
- No depender de servicios reales en tests unitarios.

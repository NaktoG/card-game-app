# Accessibility

## Estándar

La aplicación apunta a WCAG 2.1 AA como baseline práctico.

## Implementado

- Inputs con `label` asociado.
- Errores de formulario con `aria-live`.
- Botones semánticos.
- Navegación usable con teclado.
- Estados de foco visibles.
- Modal final con `role="dialog"` y `aria-modal`.
- Respeto de `prefers-reduced-motion`.
- Targets táctiles mínimos de 44px.

## Pendiente Recomendado

- Auditoría manual con VoiceOver/NVDA.
- Validación de contraste APCA/WCAG en todos los estados visuales.
- Prueba E2E de navegación por teclado.

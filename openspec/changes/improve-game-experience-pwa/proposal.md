# Proposal: Improve Game Experience PWA

## Intent

Make the first playable session understandable and trustworthy: explain the game, clarify next actions, improve accessible feedback, and make PWA install/offline behavior honest without changing deeper game mechanics.

## Scope

### In Scope
- Onboarding/rules/copy for first-time players, including objective, turn flow, tie/pot basics, and local-only ranking.
- In-game guidance and accessibility improvements for status, loading, disabled actions, card labels, and end-game dialog behavior.
- PWA trust polish: visible install affordance, clearer offline limitations, aligned app metadata/offline copy, and static-host-safe manifest updates.

### Out of Scope
- Deep rule redesign, final tied-pot scoring decision, bot difficulty, achievements, analytics, or shared/backend ranking.
- Full offline gameplay engine, advanced service-worker strategy, E2E setup, or design-system rewrite.
- Changing persisted ranking keys unless separately approved.

## Capabilities

### New Capabilities
- `game-onboarding`: Player-facing explanation of rules, objective, local ranking, and start flow.
- `gameplay-guidance-accessibility`: In-game status/help, accessible controls, card announcements, and modal behavior.
- `pwa-trust-install`: Install visibility, offline limitation messaging, and PWA metadata clarity.

### Modified Capabilities
- None — no existing main specs are present in `openspec/specs/`.

## Approach

Follow exploration Approach 1. Deliver as chained reviewable slices: copy/onboarding first, in-game guidance/accessibility second, PWA trust polish third. Preserve pure domain logic and keep runtime integrations behind existing hooks/services/config.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/features/home/HomePage.tsx` | Modified | Add concise player journey and rules. |
| `src/shared/i18n/locales/*.json` | Modified | Add consistent EN/ES game, ranking, install, offline copy. |
| `src/features/game/**` | Modified | Improve guidance, feedback, card labels, dialog accessibility. |
| `src/features/ranking/RankingPage.tsx` | Modified | Clarify local ranking copy and destructive actions. |
| `src/shared/components/InstallPrompt.tsx` | Modified | Improve mobile install visibility and outcome feedback. |
| `public/*`, `index.html` | Modified | Align metadata, manifest/offline copy, and base-path-safe assets. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Scope exceeds 400-line budget | Med | Use chained PR slices. |
| Copy documents unsettled rules | Med | Describe current behavior; keep final-pot decisions out of scope. |
| PWA asset/scope changes break GitHub Pages | Med | Preserve base-path-aware config and validate build. |
| Motion/accessibility regressions | Low | Respect reduced motion, keyboard access, and WCAG AA basics. |

## Rollback Plan

Revert the affected chained PR slice. Avoid storage schema changes; if PWA metadata causes issues, restore prior `manifest`, `sw.js`, `offline.html`, and `index.html`.

## Dependencies

- Existing React/Vite/i18n/PWA setup and Deck of Cards API runtime behavior.

## Success Criteria

- [ ] A new player can understand how to start, play, resolve ties/pot, and read ranking from UI copy.
- [ ] Main game actions and end modal are keyboard/screen-reader friendlier.
- [ ] Install/offline messaging is visible, honest, and static-host-safe.

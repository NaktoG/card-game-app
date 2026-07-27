# Design: Improve Game Experience PWA

## Technical Approach

Implement the three specs as three review slices under the 400-line budget: onboarding/i18n copy, gameplay guidance/accessibility, then PWA trust/install polish. Keep `src/features/game/domain/*` unchanged except tests if needed; all UX behavior stays in React components, hooks, i18n, and static PWA assets. The design documents current rules rather than changing mechanics or localStorage ranking keys.

## Architecture Decisions

| Option | Tradeoff | Decision |
|---|---|---|
| Add copy/UI around existing rules | Small, safe, but does not fix unresolved final-pot scoring semantics | Use current reducer behavior and explain tie/pot conservatively. |
| Derive guidance in `GamePage` from `GameState` | Keeps domain pure; some UI strings live near components | Use view-level derived labels/status, not new domain state. |
| Static relative manifest URLs | Less explicit than absolute URLs, but works on GitHub Pages/subpaths | Change manifest `start_url`, `scope`, and icons to relative paths. |
| Enhance existing components | Avoids design-system rewrite, but limits visual redesign | Modify existing `Button`, `InstallPrompt`, `EndGameModal`, and game panels only. |
| No new dependencies | Requires small custom focus/status handling | Use React refs/effects and Testing Library already present. |

## Data Flow

Nickname/lang/settings/ranking remain in existing Zustand/i18n stores. Game actions remain:

    Home copy ──start──→ App route ──→ GamePage
                               │          │
                               │          ├─ useGame ──→ deckApi ──→ Deck API
                               │          └─ derived UI status/cards/modal labels
                               └──→ RankingPage local-only explanation

PWA install flow stays browser-event driven:

    beforeinstallprompt ──→ InstallPrompt state ──prompt()──→ outcome message
    SW navigate miss ──→ offline.html explaining app shell vs card API limits

## File Changes

| File | Action | Description |
|---|---|---|
| `src/features/home/HomePage.tsx` | Modify | Add concise rules/onboarding cards near the nickname form. |
| `src/shared/i18n/locales/en.json` | Modify | Add onboarding, guidance, install, offline, card-label, and ranking copy. |
| `src/shared/i18n/locales/es.json` | Modify | Mirror EN meanings following existing bilingual convention. |
| `src/features/game/GamePage.tsx` | Modify | Add visible current status, next-action text, disabled reason, aria-live outcome, and non-blank loading/error messaging. |
| `src/features/game/components/CardView.tsx` | Modify | Accept accessible label text instead of hard-coded English side/suit strings. |
| `src/features/game/components/EndGameModal.tsx` | Modify | Improve focus management, predictable action focus/return, keyboard behavior, and reduced-motion-friendly confetti. |
| `src/features/game/components/PlayerPanel.tsx` | Modify | Add section labelling and active/winner text that is not color-only. |
| `src/shared/components/LoadingState.tsx` | Modify | Mark busy/live state for assistive tech. |
| `src/shared/components/Button.tsx` | Modify | Ensure disabled buttons expose disabled state without relying on opacity only. |
| `src/features/ranking/RankingPage.tsx` | Modify | Clarify local-only ranking and destructive clear action copy. |
| `src/shared/components/InstallPrompt.tsx` | Modify | Show compact mobile-friendly install/help affordance and accepted/dismissed/unavailable feedback. |
| `public/manifest.webmanifest` | Modify | Use relative `./` start/scope and icon paths; align description with offline limits. |
| `public/offline.html` | Modify | Explain that the shell may load offline but gameplay can require network access to the card API. |
| `index.html` | Modify | Align metadata/OG description with PWA identity and local-only ranking. |
| `src/**/*.test.tsx` | Create | Add focused component tests for onboarding copy, install outcomes, and modal/status behavior. |

## Interfaces / Contracts

No persisted schema changes. Proposed component contract change:

```ts
type CardViewProps = {
  card: GameCard | null;
  side: PlayerSide;
  isWinner: boolean;
  ariaLabel: string;
};
```

Install prompt state remains local UI state: `available | accepted | dismissed | unavailable`.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | No game-rule changes; existing reducer/rules remain green | Run existing Vitest domain suite. |
| Integration | Home onboarding copy, game status/disabled reason, modal focus, install prompt outcomes | Add Testing Library tests with mocked i18n/browser events. |
| E2E | Not available | Manual smoke: language switch, keyboard navigation, install unavailable state, offline fallback. |

## Migration / Rollout

No data migration required. Roll out through three chained PR slices: (1) onboarding/i18n/ranking copy, (2) gameplay guidance/a11y, (3) PWA install/offline metadata. Rollback is per slice; PWA rollback restores `manifest.webmanifest`, `offline.html`, `index.html`, and `InstallPrompt.tsx`.

## Open Questions

- [ ] Confirm whether the current unresolved end-of-deck tied pot should be described as current behavior only, not resolved in this change.

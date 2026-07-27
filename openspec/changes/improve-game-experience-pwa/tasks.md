# Tasks: Improve Game Experience PWA

## Review Workload Forecast

| Field                   | Value                                                      |
| ----------------------- | ---------------------------------------------------------- |
| Estimated changed lines | 550-750 total; each slice target ≤400                      |
| 400-line budget risk    | High                                                       |
| Chained PRs recommended | Yes                                                        |
| Suggested split         | PR 1 onboarding/i18n → PR 2 gameplay a11y → PR 3 PWA trust |
| Delivery strategy       | auto-chain                                                 |
| Chain strategy          | feature-branch-chain                                       |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal                                | Likely PR | Notes                                             |
| ---- | ----------------------------------- | --------- | ------------------------------------------------- |
| 1    | Explain journey/rules/local ranking | PR 1      | Base = feature/tracker branch; first apply slice. |
| 2    | Add in-game guidance and a11y       | PR 2      | Base = PR 1 branch; depends on shared copy.       |
| 3    | Polish install/offline trust        | PR 3      | Base = PR 2 branch; includes PWA assets.          |

## Phase 1: PR 1 — Onboarding and Local Ranking

- [x] 1.1 RED: add `src/features/home/HomePage.test.tsx` covering objective, turn, tie/pot, local ranking, start flow, and EN/ES parity.
- [x] 1.2 GREEN: update `src/shared/i18n/locales/en.json`, `src/shared/i18n/locales/es.json`, and `src/features/home/HomePage.tsx` with concise onboarding cards.
- [x] 1.3 RED: add `src/features/ranking/RankingPage.test.tsx` for local-only ranking and clear-ranking warning copy.
- [x] 1.4 GREEN/REFACTOR: update `src/features/ranking/RankingPage.tsx` copy without changing ranking storage keys; run `npm test`.

## Phase 2: PR 2 — Gameplay Guidance and Accessibility

- [x] 2.1 RED: add `src/features/game/GamePage.test.tsx` for visible status, next action, disabled/pending feedback, loading, and error states.
- [x] 2.2 GREEN: update `src/features/game/GamePage.tsx`, `src/shared/components/LoadingState.tsx`, and `src/shared/components/Button.tsx` with live/busy/disabled feedback.
- [x] 2.3 RED: add component tests for card labels, `PlayerPanel` active/winner text, and `EndGameModal` focus/keyboard behavior.
- [x] 2.4 GREEN/REFACTOR: update `CardView.tsx`, `PlayerPanel.tsx`, and `EndGameModal.tsx`; preserve `src/features/game/domain/*`; run `npm test`.

## Phase 3: PR 3 — PWA Trust and Install

- [x] 3.1 RED: add `src/shared/components/InstallPrompt.test.tsx` for available, accepted, dismissed, and unavailable install outcomes.
- [x] 3.2 GREEN: update `src/shared/components/InstallPrompt.tsx` plus EN/ES install copy with compact non-blocking feedback.
- [x] 3.3 Update `public/manifest.webmanifest`, `public/offline.html`, and `index.html` with relative asset paths and honest offline limits.
- [x] 3.4 REFACTOR/VERIFY: run `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`; manually smoke language switch, keyboard flow, and offline fallback.

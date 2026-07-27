## Exploration: improve-game-experience-pwa

### Current State
The app is a React 19 + Vite + strict TypeScript static SPA with a feature-based structure. The strongest part is the game domain: card mapping, hand resolution, reducer behavior, and ranking updates are separated from React and already covered by Vitest unit tests in `src/features/game/domain/*.test.ts`. The UI has a polished neon/cinematic direction using Tailwind, Framer Motion, bilingual i18n, local persistence via Zustand, and a basic PWA layer with manifest, service worker registration, runtime caching, and an offline fallback.

The main product gap is not raw implementation quality; it is experience clarity. A new user sees a stylish arena, but the app does not clearly explain the rules, objective, tie/pot behavior, local-only ranking, API/offline limitations, or what to do next at each stage. Several accessibility/PWA details are also underdeveloped: install is hidden below `lg`, `html lang` is hardcoded to Spanish, loading feedback is visual-only, the end modal lacks escape/backdrop/focus-trap behavior, manifest icons are SVG-only, and offline mode cannot support gameplay because the Deck of Cards API is intentionally bypassed by the service worker.

### Affected Areas
- `src/features/home/HomePage.tsx` — Primary onboarding surface; currently has brand copy, nickname form, and feature badges but no concise rule explanation or player journey.
- `src/shared/i18n/locales/en.json` — English copy source; needs rules, onboarding, in-game helper text, PWA/offline/install copy, and clearer ranking wording.
- `src/shared/i18n/locales/es.json` — Existing Spanish locale must be preserved/updated consistently if app remains bilingual.
- `src/features/game/GamePage.tsx` — Core play screen; needs contextual status, clear next action, rule hints for tie/pot, error/offline guidance, and better disabled/loading semantics.
- `src/features/game/hooks/useGame.ts` — Coordinates API calls, sound, state, and ranking side effects; AbortControllers are created but not retained/aborted, errors are generic, and network/offline states are not distinguished.
- `src/features/game/domain/gameReducer.ts` — Current tie logic keeps tied cards in the pot until a later winner; if the final hand is a tie, the unresolved pot remains unawarded while final result only counts player/CPU piles.
- `src/features/game/domain/gameRules.ts` — Winner resolution is simple and testable; any rule refinement should stay here or in adjacent pure domain code.
- `src/features/game/components/EndGameModal.tsx` — Needs stronger dialog behavior: focus containment, Escape handling, accessible close/backdrop semantics if dismissible, and reduced-motion-safe celebration.
- `src/features/game/components/CardView.tsx` — Uses API images with an empty `alt` and an aria-label on the wrapper; can improve visible/announced card naming and fallback behavior.
- `src/features/game/components/Scoreboard.tsx` — Useful data, but labels do not explain pot/remaining/hands-left meaning for first-time players.
- `src/features/ranking/RankingPage.tsx` — Ranking is clear technically but copy exposes `LocalStorage` as a raw implementation label and lacks confirmation before destructive clearing.
- `src/features/ranking/rankingStore.ts` — Ranking aggregation is local and nickname-based; good enough now, but future scoring changes need tests to avoid breaking persisted expectations.
- `src/shared/components/InstallPrompt.tsx` — PWA install button is hidden on small screens even though install is most valuable on mobile; prompt outcome is not handled.
- `public/manifest.webmanifest` — Basic install metadata exists but lacks PNG 192/512 icons, screenshots, shortcuts, categories, and richer app identity.
- `public/sw.js` — Service worker provides shell/offline fallback and avoids caching Deck API; this is safe, but offline gameplay is not supported and users are not told why.
- `public/offline.html` — Offline page is Spanish-only static copy and does not explain that gameplay needs network access.
- `index.html` — Metadata is Spanish-first and `lang="es"` is static despite runtime i18n; social/deployment copy is inconsistent with the GitHub Pages footer.
- `src/styles/globals.css` and `tailwind.config.js` — Visual foundation exists but design tokens are mostly inline Tailwind classes; a first slice should avoid a full design-system rewrite.
- `src/shared/registerServiceWorker.ts` and `src/shared/config/appConfig.ts` — PWA registration respects base path; changes should preserve static-host compatibility.
- `src/features/game/domain/*.test.ts` — Existing TDD foothold; should be extended if rule behavior, final-pot handling, or score/ranking semantics change.

### Approaches
1. **First playable experience slice** — Improve onboarding/rules, in-game guidance, accessible feedback, mobile install visibility, offline/PWA copy, and targeted tests without changing the core game architecture.
   - Pros: Directly addresses the user's product intent, fits chained PR delivery, preserves pure domain boundaries, reduces confusion fast, and avoids risky rewrites.
   - Cons: Does not solve every architecture/design-system/PWA audit item; some deeper game-rule decisions remain explicit follow-ups.
   - Effort: Medium

2. **Deep game mechanics revision first** — Redesign rules, scoring, final-pot behavior, ranking formulas, local bot identity/difficulty, and domain tests before changing UI polish.
   - Pros: Produces a stronger underlying game contract and prevents copy from documenting weak rules.
   - Cons: Higher product-decision risk, likely exceeds the 400 changed-line review budget, and delays visible UX improvements.
   - Effort: High

3. **Visual/PWA polish first** — Focus on manifest, icons, screenshots, service worker strategy, layout refinement, motion tuning, and design-token cleanup.
   - Pros: Improves installability, perceived quality, and platform polish.
   - Cons: Leaves the biggest user problem unresolved: people still may not understand what the game is, how to play, or why network/offline behavior works as it does.
   - Effort: Medium

### Recommendation
Use **Approach 1: First playable experience slice** as the proposal scope. It should be delivered as chained PRs under the 400-line budget:

- PR slice 1: Product copy and onboarding/rules — enrich `HomePage`, i18n files, and ranking/game explanatory copy.
- PR slice 2: In-game UX and accessibility — add status/help patterns, improve loading/error/disabled semantics, strengthen modal accessibility, and preserve reduced-motion behavior.
- PR slice 3: PWA trust polish — make install visible where useful, clarify offline limitations, improve manifest metadata/icons where practical, and align HTML/offline copy.
- PR slice 4 only if approved: game-rule refinement — decide and test final tied-pot behavior, scoring semantics, and ranking tie-breakers.

Scope now should include explanation, copy, accessibility feedback, install/offline clarity, and small UI structure improvements. Scope later should include full design-system extraction, offline gameplay mode, E2E setup, advanced service worker strategies, bot difficulty, achievements, analytics, or backend/shared ranking.

### Risks
- The requested scope is broad; trying to improve UX/UI, architecture, logic, copy, onboarding, and PWA in one PR would exceed the review budget and blur acceptance criteria.
- Changing game rules without an explicit product decision can invalidate current tests and confuse ranking history stored in `localStorage`.
- PWA improvements can accidentally break static-host/base-path behavior if manifest, service worker scope, or asset URLs are changed carelessly.
- More Framer Motion polish can hurt users with motion sensitivity unless every animation remains compatible with `prefers-reduced-motion`.
- Offline gameplay is not available because the game depends on Deck of Cards API at runtime; messaging must be honest unless a separate offline deck engine is built.

### Ready for Proposal
Yes — tell the user the first SDD proposal should target a coherent “first playable experience” slice: explain the game clearly, make the next action obvious, improve accessible feedback, polish install/offline trust signals, and defer deeper mechanics/design-system/offline-engine work into later chained changes.

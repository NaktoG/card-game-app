# Neon Card Arena — Cinematic Design Package

Status: `approved`
Project class: `portfolio`
Architecture: `React + Vite + Tailwind CSS + Framer Motion`
Primary CTA: `Start / continue the card battle`

## 1. Product and audience

**Product:** browser card battle against the CPU with local ranking.

**Experience goal:** make the existing game feel like entering a premium neon card arena rather than viewing a generic animated demo.

**Primary user journey:**

`Home -> identify player -> enter arena -> play hands -> receive result feedback -> ranking`

**Primary CTA:** start or continue the game.

The existing game logic, routing model, stores, PWA behavior, i18n and ranking persistence remain product requirements.

## 2. Brand premise

**Governing idea:** *Enter the Neon Card Arena.*

The interface behaves like a digital arena built around a physical card table.

**Must feel:**
- competitive;
- tactile;
- atmospheric;
- precise;
- premium;
- energetic when game events occur.

**Must not feel:**
- like a looping screensaver;
- overloaded with particles;
- like a casino advertisement;
- dependent on video;
- visually active when nothing important is happening.

## 3. Visual system

Preserve the current dark neon identity.

### Core palette direction

- deep slate / near-black environment;
- lime as primary competitive/action accent;
- cyan as secondary depth/light accent;
- violet as tertiary atmospheric accent;
- rose reserved for danger/heart/card semantics.

Do not introduce a new dominant brand color without a specific reason.

### Typography

Preserve the existing display/body hierarchy unless testing demonstrates a clear improvement.

Typography must remain readable over every animated state.

### Signature visual element

**The card table / arena field.**

Cards, panels, lighting and spatial depth should feel like parts of one arena rather than independent glass components.

## 4. Cinematic story and resting states

### Home — Arrival

**Beginning:** restrained arena atmosphere.

**Entrance choreography:**
1. arena depth establishes;
2. brand/eyebrow enters;
3. headline and description resolve;
4. nickname panel becomes actionable;
5. card composition settles into its final pose.

The final state must be mostly calm.

Pointer movement may create subtle bounded depth/parallax on capable devices, never continuous uncontrolled motion.

### Home -> Game — Enter the arena

The transition should communicate spatial continuity rather than a generic page fade.

Preferred concept:
- CTA commits;
- home cards compress or move toward the arena;
- interface transitions into the game table;
- Game screen resolves quickly into an interactive resting state.

No transition may delay gameplay unnecessarily.

### Game — Event-driven motion

Idle state should be calm.

Motion is reserved primarily for:
- starting a game;
- drawing a hand;
- revealing cards;
- winner/tie feedback;
- score changes;
- end-game result.

Cards should feel physical through perspective, spring response, shadow and restrained lighting.

### Ranking — Cool-down / prestige

Ranking is calmer than the game.

Use hierarchy and subtle staged reveal rather than permanent decorative movement.

Top positions may receive stronger visual distinction without harming readability.

## 5. Motion architecture

Use the existing deterministic frontend stack first:

`Framer Motion + CSS + SVG`

Optional browser effects may be added only when they materially improve the concept.

### Do not use in v1

- generative video;
- AI-generated hero video;
- scroll-scrub video;
- HyperFrames render assets;
- permanent WebGL scene.

These remain available later if a concrete visual requirement justifies them.

### Motion principle

**Event-driven > perpetual animation.**

Replace unnecessary infinite loops with:
- finite entrance sequences;
- interaction response;
- game-state transitions;
- occasional low-frequency atmospheric movement only where justified.

## 6. Reduced motion and accessibility

`prefers-reduced-motion` must affect JavaScript/Framer Motion behavior, not only CSS durations.

Reduced-motion mode must:
- preserve hierarchy;
- preserve game feedback;
- avoid large spatial transitions;
- avoid perpetual decorative animation;
- remain fully usable.

Maintain:
- visible keyboard focus;
- semantic controls;
- readable contrast;
- minimum practical touch targets;
- status/error announcements;
- navigation clarity.

## 7. Performance budget

The cinematic treatment must not require video or remote generative assets.

Priorities:
1. reuse existing assets;
2. transforms and opacity;
3. bounded Framer Motion interactions;
4. CSS/SVG lighting and depth;
5. heavier techniques only with measured justification.

Avoid permanent `requestAnimationFrame` or animation loops when the screen is visually settled.

Decorative effects should pause or disappear when reduced motion is active and should avoid unnecessary offscreen work.

## 8. Component direction

### `ArenaBackdrop`

Transform from a collection of independent infinite effects into a coherent arena environment.

Reduce decorative perpetual motion.

### `HomePage`

Keep the existing information architecture and nickname flow.

Upgrade:
- staged entrance;
- card composition;
- depth;
- lighting;
- CTA emphasis;
- interaction response.

### `MotionPage`

Evolve generic page fade into route-aware transitions only where useful.

Do not make every route transition equally dramatic.

### `CardView`

Preserve the existing 3D foundation.

Improve:
- reveal choreography;
- physical depth;
- winner emphasis;
- hover restraint;
- reduced-motion behavior.

### `DeckStack`

Use animation to communicate draw/loading state.

Idle deck should remain visually settled.

### `PlayerPanel` / `Scoreboard`

Make state changes feel connected to the card-table event.

Avoid unnecessary idle animation.

### `RankingPage`

Use restrained staged reveal and hierarchy.

Do not turn the ranking into another game scene.

## 9. Copy gate

Existing Spanish and English viewer-facing copy remains the baseline.

Do not silently rewrite product messaging during the visual redesign.

Any substantive copy or branding change requires explicit approval.

Current identity to preserve:

**Neon Card Arena**

## 10. Media route

Selected route:

`existing + deterministic`

Current media requirements:
- existing card imagery;
- CSS/SVG lighting;
- Framer Motion choreography.

**HyperFrames:** not required for v1.

**FFmpeg:** not required for v1.

**Generative media:** not required for v1.

This is intentionally the cheapest sufficient route.

## 11. Implementation scope

Initial cinematic pass may modify visual/presentation behavior in:
- shared arena/background components;
- Home;
- Game presentation;
- card/deck motion;
- route transitions;
- Ranking presentation;
- motion accessibility handling;
- supporting styles/tests.

Do not alter game-domain rules, persistence semantics, API behavior or unrelated infrastructure unless validation exposes a necessary defect.

## 12. Validation gates

Before completion verify:
- `npm run typecheck`;
- `npm run lint`;
- `npm test`;
- `npm run build`;
- existing E2E flow when available;
- desktop layout;
- mobile layout;
- keyboard navigation;
- reduced-motion behavior;
- no unexpected console errors;
- game flow preserved;
- ranking preserved;
- fast repeated interactions;
- no animation deadlocks;
- no unnecessary permanent motion;
- visual continuity Home -> Game -> Ranking;
- independent QA/review.

## 13. Approval

Status: `approved`

Approved for implementation.

Open question for review:
Does this direction represent the desired premium/cinematic identity for the first Atonix real-project test?

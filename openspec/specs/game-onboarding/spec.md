# Game Onboarding Specification

## Purpose

Help first-time players understand the game objective, turn flow, tie/pot basics, and local-only ranking before starting play.

## Requirements

### Requirement: Explain the playable journey

The system MUST present concise onboarding that explains the objective, how turns work, what a tie/pot means, and that ranking is stored locally only.

#### Scenario: New player learns before starting

- GIVEN a player opens the home/start experience
- WHEN they review the onboarding content
- THEN they can identify the objective, turn action, tie/pot concept, and local ranking limitation
- AND they can start the game from the same flow

#### Scenario: Bilingual onboarding stays consistent

- GIVEN the player switches between supported languages
- WHEN onboarding copy is displayed
- THEN the same gameplay and ranking meanings are available in each language

#### Scenario: Out-of-scope mechanics remain unchanged

- GIVEN onboarding mentions ties or ranking
- WHEN the player starts a game
- THEN the game MUST keep existing rule behavior and persisted ranking keys unchanged

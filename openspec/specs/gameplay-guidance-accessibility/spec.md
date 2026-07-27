# Gameplay Guidance Accessibility Specification

## Purpose

Make in-game state, actions, card information, and end-game outcomes understandable and accessible without changing game rules.

## Requirements

### Requirement: Guide current game state and actions

The system MUST communicate the current game status, available next action, pending/loading states, disabled action reasons, and round outcomes in perceivable text.

#### Scenario: Player understands next action

- GIVEN a game round is ready for player input
- WHEN the game view is displayed
- THEN the player can determine the next available action and current status without relying only on color or motion

#### Scenario: Pending action prevents duplicate input

- GIVEN a game action is in progress
- WHEN the player attempts to trigger the same action again
- THEN the action is disabled or ignored with clear feedback until the pending state resolves

#### Scenario: Loading or error is not blank

- GIVEN card or deck data is loading or fails
- WHEN the game view updates
- THEN the system MUST show an understandable loading or error state, not an empty screen

### Requirement: Provide accessible card and modal feedback

The system MUST expose card identity, winner/tie feedback, and end-game dialog behavior to keyboard and assistive-technology users.

#### Scenario: Card information is announced

- GIVEN cards are visible in a round
- WHEN a keyboard or screen-reader user inspects the play area
- THEN each relevant card has a meaningful accessible label

#### Scenario: End-game dialog is operable

- GIVEN the game ends
- WHEN the result dialog appears
- THEN focus moves into the dialog, keyboard actions work, and closing or restarting returns focus predictably

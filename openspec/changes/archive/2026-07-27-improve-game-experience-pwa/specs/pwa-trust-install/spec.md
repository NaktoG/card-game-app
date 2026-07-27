# PWA Trust Install Specification

## Purpose

Make install and offline behavior visible, honest, and static-host-safe for the PWA.

## Requirements

### Requirement: Present install affordance and outcome

The system MUST offer a visible install affordance when installation is available and MUST communicate accepted, dismissed, or unavailable outcomes.

#### Scenario: Install is available

- GIVEN the browser reports that install is available
- WHEN the player sees the app shell
- THEN an install action is visible and describes the benefit without blocking play

#### Scenario: Install is unavailable or dismissed

- GIVEN install is unsupported, already installed, or dismissed
- WHEN the install area is shown or used
- THEN the player receives accurate feedback and can continue using the app

### Requirement: State offline limits honestly

The system MUST distinguish app shell availability from gameplay dependency on runtime card/deck access and MUST NOT promise a full offline gameplay engine.

#### Scenario: Offline fallback explains limits

- GIVEN the player opens the app without network access
- WHEN offline fallback or offline copy is displayed
- THEN it explains that some content may load but gameplay can require network card/deck access

#### Scenario: Metadata remains install-safe

- GIVEN the app is installed or served from a static subpath
- WHEN metadata, manifest, icons, and offline copy are used
- THEN app identity is consistent and asset references remain static-host-safe

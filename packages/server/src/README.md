# Princeps Game Server

Handles match from Princeps Memory Game.

Entry Point: `PrincepsServer`. Allows a match between 2-6 players and any number of rounds.

Take a look at the `game-server.js` script which set up the PrincepsServer.

## Directory Structure and Relevant classes

- `root` - Glues the networking with the game-specific resources and manages
- `services` - Services with specific responsibilities to manage the game and keep game state
- `commands/*` - Provides commands handling classes and commands sent to the players
- `commands/handlers/*` - Handle incoming client commands and control the game flow
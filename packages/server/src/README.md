# Princeps Game Server

Handles match from Princeps Memory Game.

Entry Point: `PrincepsServer`. Allows a match between 2-4 players and any number os rounds.

```js
const server = new PrincepsServer();

server.addExpectedPlayer( new PrincepsConnectionInfo("ABCD"));
server.addExpectedPlayer( new PrincepsConnectionInfo("1234"));
server.addExpectedPlayer( new PrincepsConnectionInfo("5555"));

server.start(16, 2);
```

## Directory Structure and Relevant classes

- `root` - Glues the networking with the game-specific resources and manages
- `services` - Services with specific responsibilities to manage the game and keep game state
- `commands/*` - Provides commands handling classes and commands sent to the players
- `commands/handlers/*` - Handle incoming client commands and control the game flow
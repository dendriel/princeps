# Princeps - Memory Game

The Princeps project is an online Web Memory Game to be played up to 4 players.

The game client and server are written using `Typescript` language, `Phaser` for game engine and `Rozsa MOGS` (a
multiplayer lib over Socket.io) for Websocket communication. Also, the game is hosted on AWS.

# Game screenshots

![loby](docs/lobby.png "Lobby")

![gameplay](docs/gameplay.png "Gameplay")


## Features

- Multiplayer Online Game
- Websocket network communication with authoritative server (client-server arch)
- Lobby and Matchmaking support
  - Lobby sharing via code
  - *Matchmaking mode needs to be reactivated in the code and needs an extra service to create the matches
- Allows players to reconnect to the match
- Configuration-based content
- Game server auto-shutdown (when maximum time or no connected players)

*Not very well-supported in mobile browsers.

## TODO

- Update docs
  - add doc about the infrastructure
  - explain the images

- Add a message-log (or a chat) to improve the notifications experience
- Allows to display players entering the lobby
- Add sounds

## NTH

- Add an browser icon
- Scale the game automatically accordingly with the screen size
- Configure a logging agent to push logs to Cloud

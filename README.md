# Princeps - Memory Game

The Princeps project is an online Web Memory Game to be played up to 4 players.

The game client and server are written using `Typescript` language, `Phaser` for game engine and `Rozsa MOGS` (a
multiplayer lib over Socket.io) for Websocket communication. Also, the game is hosted on AWS.

> If you want to now more about the game project and hosting solution, check the [docs](docs/README.md) folder.

# Game screenshots

![loby](docs/lobby.png "Lobby")

![gameplay](docs/gameplay.png "Gameplay")


## Features

- Multiplayer Online Game
- Websocket network communication with authoritative server (client-server arch)
  - Use a lib I've made for creating multiplayer games Rozsa MOGS (using socket.io underneath)
- Lobby and Matchmaking support
  - Lobby sharing via code
  - *Matchmaking mode needs to be reactivated in the code and needs an extra service to create the matches
- Allows players to reconnect to the match
- Resizable game canvas
- Configuration-based content
- Game server auto-shutdown (when maximum time or no connected players)
- Chat / Chat history
  - Created InputText component to allow text input because phaser doesn't provide one out of the box

## TODO

- Allow displaying players entering the lobby
  - This requires to change the phaser loading step to the moment the players enter the lobby
  - It will allow us to show message while in the lobby
- Add sounds

## NTH

- Configure a logging agent to push logs to Cloud
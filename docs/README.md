# Solution Docs

Some diagrams about the game solution.

## Game Flow (mockups)

Game windows/scenes transitions.

![gameflow](game-flow.png "Game Flow")


## Connection Flow

What should happen in the backend to support the game-flow.

![connectionflow](connection-flow.png "Connection Flow")

TODO: describe the steps

## Infrastructure

TODO

## Solution Remarks

- The player is able to create servers freely, so any ill-intended player can overload the server and make it unavailable
  - For a production game, we could track the new matches a player is creating and limit then (best if blocking by IP).
- Instead of providing the client resources via CDN, for simplicity, I've chosen to provide it directly from the
game-server instance
- To be able to keep the service running 24/7, I'm using economical (~~cheap~~ :p) amazon spot-instances which may be
interrupted at any moment and may disrupt the player matches. I've set the interruption behavior to 'hibernate', which
should restore the instance state when a new spot is assigned. With a bit of luck, the game may be restored in a few
minutes =] (idk)
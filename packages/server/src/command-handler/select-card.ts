import {ServerCommand, SelectCardPayload} from "../../../shared/dist/princeps-shared.js";
import {AbstractServerCommandHandler} from "../commands/abstract-server-command-handler.js";
import {Player} from "../game-server/player.js";
import {MatchHandler} from "../game-server/match-handler.js";

export class SelectCard extends AbstractServerCommandHandler<SelectCardPayload, ServerCommand> {
    constructor(matchHandler: MatchHandler) {
        super(ServerCommand.SELECT_CARD, matchHandler);
    }

    handleCommand(player: Player, payload: SelectCardPayload): void {

        const oppenedCard = this.matchHandler.openCard(payload.boardPos);
        if (!oppenedCard) {
            // If the card couldn't be open, keep the turn running.
            return;
        }

        // TODO: card was open. Broadcast command to show the card.

        if (!this.matchHandler.pairIsOpen()) {
            // Just the first card was open. Player can open another card.
            return;
        }

        // TODO: two cards was open. Check if the player guessed the pair right.
        if (!this.matchHandler.pairIsMatch()) {
            // Not a match. Close cards and skip player turn.

            // TODO: broadcast to clear cards.

            this.matchHandler.clearGuessedCards(true);

            // TODO: update player who will play.
            return;
        }

        // TODO: player guessed right. He keeps his turn.
        // TODO: add score to the player.
        this.matchHandler.clearGuessedCards();
    }
}
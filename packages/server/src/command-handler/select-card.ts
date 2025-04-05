import {ServerCommand, SelectCardPayload} from "../../../shared/dist/princeps-shared.js";
import {AbstractServerCommandHandler} from "../commands/abstract-server-command-handler.js";
import {Player} from "../game-server/player.js";
import {MatchHandler} from "../game-server/match-handler.js";
import {CommandDispatcher} from "../commands/command-dispatcher.js";

export class SelectCard extends AbstractServerCommandHandler<SelectCardPayload, ServerCommand> {
    constructor(commandDispatcher: CommandDispatcher, matchHandler: MatchHandler) {
        super(ServerCommand.SELECT_CARD, commandDispatcher, matchHandler);
    }

    async handleCommand(player: Player, payload: SelectCardPayload): Promise<void> {

        const oppenedCard = this.matchHandler.openCard(payload.boardPos);
        if (!oppenedCard) {
            // If the card couldn't be open, keep the turn running.
            return;
        }

        const openCardName = this.matchHandler.getCardName(payload.boardPos);
        this.commandDispatcher.broadcastShowCard(payload.boardPos, openCardName);

        if (!this.matchHandler.pairIsOpen()) {
            // Just the first card was open. Player can open another card.
            return;
        }

        await this.sleep(2000);

        // TODO: two cards was open. Check if the player guessed the pair right.
        if (!this.matchHandler.pairIsMatch()) {
            // Not a match. Close cards and skip player turn.

            this.commandDispatcher.broadcastHideCards(this.matchHandler.getGuessedCardsIndexes());
            this.matchHandler.clearGuessedCards(true);

            // TODO: update player who will play.
            return;
        }

        // TODO: player guessed right. He keeps his turn.
        // TODO: add score to the player.
        this.matchHandler.clearGuessedCards();

        // TODO: check if all cards were guessed (condition victory)
        if (!this.matchHandler.allCardsMatched()) {
            return;
        }

        // TODO: handle game end.
        // TODO: show the winner player.
    }

    sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
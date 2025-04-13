import {ServerCommand, SelectCardPayload} from "../../../shared/dist/princeps-shared.js";
import {AbstractServerCommandHandler} from "../commands/abstract-server-command-handler.js";
import {Player} from "../game-server/player.js";
import {MatchHandler} from "../game-server/match-handler.js";
import {CommandDispatcher} from "../commands/command-dispatcher.js";
import {PlayersHolder} from "../game-server/player-holder.js";

export class SelectCard extends AbstractServerCommandHandler<SelectCardPayload, ServerCommand> {
    constructor(commandDispatcher: CommandDispatcher, matchHandler: MatchHandler, playersHolder: PlayersHolder) {
        super(ServerCommand.SELECT_CARD, true, commandDispatcher, matchHandler, playersHolder);
    }

    async handleCommand(player: Player, payload: SelectCardPayload): Promise<void> {
        if (!this.matchHandler.lockPlayerGuessing()) {
            console.log(`Multiple player commands while already guessing. Discarding guess.`);
            return;
        }

        try {
            await this.selectCard(player, payload);
        } finally {
            this.matchHandler.unlockPlayerGuessing();
        }
    }

    private async selectCard(player: Player, payload: SelectCardPayload): Promise<void> {
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

        // TODO: two cards were open. Check if the player guessed the pair right.
        if (!this.matchHandler.pairIsMatch()) {
            // Not a match. Close cards and skip player turn.

            player.resetCombo();

            this.commandDispatcher.broadcastHideCards(this.matchHandler.getGuessedCardsIndexes());
            this.matchHandler.clearGuessedCards(true);

            this.commandDispatcher.deactivatePlayerTurn(player);

            this.playersHolder.updateNextPlayerToPlay();

            const nextPlayer = this.playersHolder.getCurrentPlayerToPlay();
            this.commandDispatcher.activatePlayerTurn(nextPlayer);

            return;
        }

        this.matchHandler.clearGuessedCards();

        player.addScore(2);
        this.commandDispatcher.broadcastUpdateScore();

        // TODO: check if all cards were guessed (condition victory)
        if (!this.matchHandler.allCardsMatched()) {
            player.setInCombo();
            console.log('Set player in combo');
            return;
        }

        console.log('Reset player in combo');
        player.resetCombo();
        // TODO: handle game end.
        // TODO: show the winner player.
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
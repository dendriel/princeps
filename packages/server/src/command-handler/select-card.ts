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

        if (this.matchHandler.pairIsMatch()) {
            this.commandDispatcher.broadcastRightGuessMsg();
        }
        else {
            this.commandDispatcher.broadcastWrongGuessMsg();
        }

        // TODO: reactivate sleep
        await this.sleep(2000);

        // Two cards were open. Check if the player guessed the pair right.
        if (!this.matchHandler.pairIsMatch()) {
            // Not a match. Close cards and skip player turn.

            player.resetCombo();

            this.commandDispatcher.broadcastHideCards(this.matchHandler.getGuessedCardsIndexes());
            this.matchHandler.clearGuessedCards(true);

            this.activateNextPlayerToPlay(player);

            return;
        }

        // Player guessed right.

        this.matchHandler.clearGuessedCards();

        player.addScore(2);
        this.commandDispatcher.broadcastUpdateScore();

        this.matchHandler.printMatchCards();

        if (!this.matchHandler.allCardsMatched()) {
            player.setInCombo();
            console.log(`Set player ${player.nickname} in combo`);
            this.commandDispatcher.broadcastPlayerTurnMsg(player);
            return;
        }

        player.resetCombo();

        console.log(`isMatchFinished: ${this.matchHandler.isMatchFinished()}`);

        if (!this.matchHandler.isMatchFinished()) {

            // TODO: handle the end of this match.

            console.log(`New round: ${this.matchHandler.currRound}`);
            this.commandDispatcher.broadcastNewRoundMsg(this.matchHandler.currRound, this.matchHandler.totalRounds);
            await this.sleep(2000);

            this.commandDispatcher.broadcastShufflingMsg();
            await this.sleep(2000);

            this.matchHandler.newRound();
            this.commandDispatcher.broadcastHideCards();
            this.activateNextPlayerToPlay(player);
            return;
        }

        // TODO: handle game end.
        // TODO: show the winner player.

        // game over.
        console.log("game over");
        // this.commandDispatcher.broadcastGameOver()
        await this.sleep(2000);
    }

    private activateNextPlayerToPlay(currPlayer: Player) {
        this.commandDispatcher.deactivatePlayerTurn(currPlayer);

        this.playersHolder.updateNextPlayerToPlay();

        const nextPlayer = this.playersHolder.getCurrentPlayerToPlay();
        this.commandDispatcher.activatePlayerTurn(nextPlayer);

        this.commandDispatcher.broadcastPlayerTurnMsg(nextPlayer);

    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
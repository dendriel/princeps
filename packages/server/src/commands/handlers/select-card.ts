import {ServerCommand, SelectCardPayload} from "../../../../shared/dist/princeps-shared.js";
import {AbstractServerCommandHandler} from "../abstract-server-command-handler.js";
import {Player} from "../../services/player.js";
import {MatchHandler} from "../../services/match-handler.js";
import {CommandDispatcher} from "../command-dispatcher.js";
import {PlayersHolder} from "../../services/players-holder.js";

interface OnMatchFinished {
    (): void;
}

export class SelectCard extends AbstractServerCommandHandler<SelectCardPayload, ServerCommand> {
    constructor(
        commandDispatcher: CommandDispatcher,
        matchHandler: MatchHandler,
        playersHolder: PlayersHolder,
        private onMatchFinished: OnMatchFinished
    ) {
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
            this.commandDispatcher.broadcastNewRoundMsg(this.matchHandler.currRound, this.matchHandler.totalTurns);
            await this.sleep(2000);

            this.commandDispatcher.broadcastShufflingMsg();
            await this.sleep(2000);

            this.matchHandler.newRound();
            this.commandDispatcher.broadcastHideCards();
            this.activateNextPlayerToPlay(player);
            return;
        }

        // game over.
        console.log("game over");

        const winners = this.playersHolder.getPlayerWithMostPoints();
        const gameOverMsg = this.buildGameOverMsg(winners);

        this.commandDispatcher.broadcastFinishGame(gameOverMsg);

        // TODO: halt server.
        await this.sleep(2000);

        this.onMatchFinished();
    }

    private activateNextPlayerToPlay(currPlayer: Player) {
        this.commandDispatcher.deactivatePlayerTurn(currPlayer);

        this.playersHolder.updateNextPlayerToPlay();

        const nextPlayer = this.playersHolder.getCurrentPlayerToPlay();
        this.commandDispatcher.activatePlayerTurn(nextPlayer);

        this.commandDispatcher.broadcastPlayerTurnMsg(nextPlayer);
    }

    private buildGameOverMsg(winners: Player[]): string {
        if (winners.length > 1) {
            return "The Match ended in a Draw =|";
        }

        const winner = winners[0];

        return `${winner.nickname} Won the Match With ${winner.score} Pts`;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
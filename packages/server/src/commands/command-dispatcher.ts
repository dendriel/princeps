import {NetworkServer} from "rozsa-mogs";
import {Player} from "../services/player.js";
import {
    ClientCommand, LoadGamePayload, CardInfoPayload, UpdateScorePayload, CardsInfoPayload, FinishGamePayload,
    ShowMessagePayload} from "../../../shared/dist/princeps-shared.js";
import {OpenCard} from "../services/match-handler.js";
import {PlayersHolder} from "../services/players-holder.js";


export class CommandDispatcher {
    // Not the ideal place to do this, but a convenient one for now :-p
    // Would be better to create a server-side ChatManager to keep this history. It would be a better place to even
    // track individual player chat history (if we did send individual chat messages to players).
    private readonly chatHistory: string[];

    constructor(private networkServer: NetworkServer, private playersHolder: PlayersHolder) {
        this.chatHistory = [];
    }

    broadcastLoadGame(boardSize: number) {
        const loadGamePayload = new LoadGamePayload(boardSize);
        this.networkServer.broadcast(ClientCommand.LOAD_GAME, loadGamePayload);
    }

    loadGameState(player: Player, boardSize: number, openCards: OpenCard[] = []) {

        const cardsInfoPayload = new CardsInfoPayload();
        openCards.forEach(c => cardsInfoPayload.addCardInfo(new CardInfoPayload(c.pos, c.name)));

        const loadGameStatePayload = new LoadGamePayload(boardSize, cardsInfoPayload, this.chatHistory);
        this.networkServer.send(player.token, ClientCommand.LOAD_GAME, loadGameStatePayload);
    }

    deactivatePlayerTurn(player: Player) {
        this.networkServer.send(player.token, ClientCommand.DEACTIVATE_TURN, {});
    }

    activatePlayerTurn(player: Player) {
        this.networkServer.send(player.token, ClientCommand.ACTIVATE_TURN, {});
    }

    broadcastShowCard(cardPos: number, cardName: string) {
        const cardInfoPayload = new CardInfoPayload(cardPos, cardName);
        this.networkServer.broadcast(ClientCommand.SHOW_CARD, cardInfoPayload);
    }

    broadcastHideCards(cardsIndex: number[] = []) {
        const cardsInfoPayload = new CardsInfoPayload();
        cardsIndex.forEach((index: number) => {
            cardsInfoPayload.addCardInfo(new CardInfoPayload(index));
        });

        this.networkServer.broadcast(ClientCommand.HIDE_CARDS, cardsInfoPayload);
    }

    broadcastUpdateScore() {
        const payload = new UpdateScorePayload();

        this.playersHolder.players
            .filter(p => p.nickname)
            .map(p => payload.add([p.nickname, p.score]));

        this.networkServer.broadcast(ClientCommand.UPDATE_SCORE, payload);
    }

    broadcastFinishGame(gameOverMsg: string) {
        const payload = new FinishGamePayload(gameOverMsg);
        this.networkServer.broadcast(ClientCommand.FINISH_GAME, payload);
    }

    broadcastMessage(text: string) {
        this.chatHistory.push(text);
        const payload = new ShowMessagePayload(text);
        this.networkServer.broadcast(ClientCommand.SHOW_MESSAGE, payload);
    }

    broadcastPlayerTurnMsg(player: Player) {
        this.broadcastMessage(`${player.nickname}'s Turn`);
    }

    broadcastWrongGuessMsg() {
        this.broadcastMessage("Wrong Guess");
    }

    broadcastRightGuessMsg() {
        this.broadcastMessage("Right Guess!");
    }

    broadcastNewRoundMsg(round: number, maxRounds: number) {
        this.broadcastMessage(`New Round ${round}/${maxRounds}`);
    }

    broadcastShufflingMsg() {
        this.broadcastMessage(`Shuffling Cards`);
    }

    broadcastPlayerChatMessage(message: string, playerNickname: string) {
        const formatted = `<${playerNickname}>\n${message}`;
        this.broadcastMessage(formatted);
    }
}
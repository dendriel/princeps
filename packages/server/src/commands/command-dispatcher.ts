import {NetworkServer} from "rozsa-mogs";
import {Player} from "../game-server/player.js";
import {ClientCommand, LoadGamePayload, CardInfoPayload, UpdateScorePayload} from "../../../shared/dist/princeps-shared.js";
import {CardsInfoPayload} from "@rozsa/shared";
import {OpenCard} from "../game-server/match-handler.js";
import {PlayersHolder} from "../game-server/player-holder.js";


export class CommandDispatcher {
    constructor(private networkServer: NetworkServer, private playersHolder: PlayersHolder) {}


    broadcastLoadGame(boardSize: number) {
        const loadGamePayload = new LoadGamePayload(boardSize);
        this.networkServer.broadcast(ClientCommand.LOAD_GAME, loadGamePayload);
    }

    loadGameState(player: Player, boardSize: number, openCards: OpenCard[] = []) {

        const cardsInfoPayload = new CardsInfoPayload();
        openCards.forEach(c => cardsInfoPayload.addCardInfo(new CardInfoPayload(c.pos, c.name)));

        const loadGameStatePayload = new LoadGamePayload(boardSize, cardsInfoPayload);
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

    broadcastHideCards(cardsIndex: number[]) {
        const cardsInfoPayload = new CardsInfoPayload();
        cardsIndex.forEach((index: number) => {
            cardsInfoPayload.addCardInfo(new CardInfoPayload(index));
        });

        this.networkServer.broadcast(ClientCommand.HIDE_CARDS, cardsInfoPayload);
    }

    broadcastUpdateScore() {
        const payload = new UpdateScorePayload();

        this.playersHolder.players.map(p => payload.add([p.nickname, p.score]));

        this.networkServer.broadcast(ClientCommand.UPDATE_SCORE, payload);
    }
}
import {NetworkServer} from "rozsa-mogs";
import {Player} from "../game-server/player.js";
import {ClientCommand, LoadGamePayload, CardInfoPayload} from "../../../shared/dist/princeps-shared.js";
import {CardsInfoPayload} from "@rozsa/shared";


export class CommandDispatcher {

    constructor(private networkServer: NetworkServer) {}


    broadcastloadMap(boardSize: number) {
        const loadGamePayload = new LoadGamePayload(boardSize);
        this.networkServer.broadcast(ClientCommand.LOAD_GAME, loadGamePayload);
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
}
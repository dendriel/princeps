import {NetworkClient} from "rozsa-mogs-client";
import {SelectCardPayload, ServerCommand} from "../../../../shared/dist/princeps-shared.js";
import {Card} from "../../game/card.js";

export class CommandDispatcher {
    constructor(private networkClient: NetworkClient) {}

    selectCard(card: Card) {
        const payload = new SelectCardPayload(card.boardPos);
        this.networkClient.send(ServerCommand.SELECT_CARD, payload);
    }
}
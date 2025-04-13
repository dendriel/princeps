import {NetworkClient} from "rozsa-mogs-client";
import {SelectCardPayload, UpdateNicknamePayload, ServerCommand} from "../../../../shared/dist/princeps-shared.js";
import {Card} from "../../game/card.js";

export class CommandDispatcher {
    constructor(private networkClient: NetworkClient) {}

    selectCard(card: Card) {
        const payload = new SelectCardPayload(card.boardIndex);
        this.networkClient.send(ServerCommand.SELECT_CARD, payload);
    }

    updateNickname(nickname: string) {
        const payload = new UpdateNicknamePayload(nickname);
        this.networkClient.send(ServerCommand.UPDATE_NICKNAME, payload);
    }
}
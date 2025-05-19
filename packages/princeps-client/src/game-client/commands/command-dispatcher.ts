import {NetworkClient} from "rozsa-mogs-client";
import {SelectCardPayload, SendChatMessagePayload, UpdateNicknamePayload, ServerCommand} from "../../../../shared/dist/princeps-shared.js";
import {Card} from "../../game/card.js";

export class CommandDispatcher {
    constructor(private networkClient: NetworkClient) {}

    selectCard(card: Card) {
        const payload = new SelectCardPayload(card.boardIndex);
        this.send(ServerCommand.SELECT_CARD, payload);
    }

    sendChatMessage(message: string) {
        const payload = new SendChatMessagePayload(message);
        this.send(ServerCommand.SEND_CHAT_MESSAGE, payload);
    }

    updateNickname(nickname: string) {
        const payload = new UpdateNicknamePayload(nickname);
        this.send(ServerCommand.UPDATE_NICKNAME, payload);
    }

    send(command: string, payload: any) {
        console.log(`Dispatching command '${command}' with payload: ${JSON.stringify(payload)}`);
        this.networkClient.send(command, payload);
    }
}
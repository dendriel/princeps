import {AbstractServerCommandHandler} from "../abstract-server-command-handler.js";
import {SendChatMessagePayload, ServerCommand} from "@rozsa/shared";
import {CommandDispatcher} from "../command-dispatcher.js";
import {MatchHandler} from "../../services/match-handler.js";
import {PlayersHolder} from "../../services/players-holder.js";
import {Player} from "../../services/player.js";

export class SendChatMessage extends AbstractServerCommandHandler<SendChatMessagePayload, ServerCommand> {
    constructor(commandDispatcher: CommandDispatcher, matchHandler: MatchHandler, playersHolder: PlayersHolder) {
        super(ServerCommand.SEND_CHAT_MESSAGE, false, commandDispatcher, matchHandler, playersHolder);
    }

    handleCommand(player: Player, payload: SendChatMessagePayload): Promise<void> {
        console.log(`Chat message from ${player.nickname} ${payload.message}`);
        if (!payload.message) {
            return Promise.resolve(undefined);
        }

        this.commandDispatcher.broadcastPlayerChatMessage(payload.message, player.nickname);

        return Promise.resolve(undefined);
    }

}
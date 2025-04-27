import {ServerCommand, UpdateNicknamePayload} from "../../../../shared/dist/princeps-shared.js";
import {AbstractServerCommandHandler} from "../abstract-server-command-handler.js";
import {CommandDispatcher} from "../command-dispatcher.js";
import {MatchHandler} from "../../services/match-handler.js";
import {Player} from "../../services/player.js";
import {PlayersHolder} from "../../services/players-holder.js";


export class UpdateNickname extends AbstractServerCommandHandler<UpdateNicknamePayload, ServerCommand> {
    constructor(commandDispatcher: CommandDispatcher, matchHandler: MatchHandler, playersHolder: PlayersHolder) {
        super(ServerCommand.UPDATE_NICKNAME, false, commandDispatcher, matchHandler, playersHolder);
    }

    async handleCommand(player: Player, payload: UpdateNicknamePayload): Promise<void> {
        player.nickname = payload.nickname;

        this.commandDispatcher.broadcastUpdateScore();

        if (this.matchHandler.isMatchStarted()) {
            const currPlayer = this.playersHolder.getCurrentPlayerToPlay()
            this.commandDispatcher.broadcastPlayerTurnMsg(currPlayer)
        }

        return Promise.resolve(undefined);
    }


}
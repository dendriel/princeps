import {ServerCommand, UpdateNicknamePayload} from "../../../shared/dist/princeps-shared.js";
import {AbstractServerCommandHandler} from "../commands/abstract-server-command-handler.js";
import {CommandDispatcher} from "../commands/command-dispatcher.js";
import {MatchHandler} from "../game-server/match-handler.js";
import {PlayersHolder} from "../game-server/player-holder.js";
import {Player} from "../game-server/player.js";


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
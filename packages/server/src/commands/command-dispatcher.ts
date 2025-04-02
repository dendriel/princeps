import {LoadGamePayload} from "../../../shared/dist/commands-payload/load-game-payload.js";
import {Size} from "../../../shared/dist/properties/size.js";
import {ClientCommand} from "../../../shared/dist/client-command.js";
import {NetworkServer} from "rozsa-mogs";
import {Player} from "../game-server/player.js";


export class CommandDispatcher {

    constructor(private networkServer: NetworkServer) {}


    broadcastloadMap(boardSize: Size) {
        const loadGamePayload = new LoadGamePayload(boardSize);
        this.networkServer.broadcast(ClientCommand.LOAD_GAME, loadGamePayload);
    }

    deactivatePlayerTurn(player: Player) {
        this.networkServer.send(player.token, ClientCommand.DEACTIVATE_TURN, {});
    }

    activatePlayerTurn(player: Player) {
        this.networkServer.send(player.token, ClientCommand.ACTIVATE_TURN, {});
    }
}
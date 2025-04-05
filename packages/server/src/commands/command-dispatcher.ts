import {LoadGamePayload} from "../../../shared/dist/commands-payload/load-game-payload.js";
import {NetworkServer} from "rozsa-mogs";
import {Player} from "../game-server/player.js";
import {ClientCommand} from "../../../shared/dist/princeps-shared.js";


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
}
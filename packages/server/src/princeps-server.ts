import mogs, {ActiveConnection, GameServer, NetworkServer, ConnectionInfo} from "rozsa-mogs";
import {Player} from "./player.js";

/**
 * Server provider for Princeps Game.
 */
export class PrincepsServer implements GameServer {

    private networkServer: NetworkServer;

    private connectedPlayers: Map<String, Player>;

    constructor() {
        this.connectedPlayers = new Map<String, Player>();
        this.networkServer = new mogs.NetworkServer(this);
    }

    start() {
        this.networkServer.listen();
    }

    addExpectedPlayer(connInfo: ConnectionInfo) {
        this.networkServer.addExpectedConnection(connInfo);

        // this._networkServer.removeExpectedConnection(player.info.token());
    }

    onConnection(conn: ActiveConnection) {
        const newPlayer = new Player(conn);
        this.connectedPlayers.set(conn.socket.id, newPlayer);

        console.log(`Player connected: ${JSON.stringify(newPlayer)}`);
    }

    onDisconnection(conn: ActiveConnection) {
        const player = this.connectedPlayers.get(conn.socket.id);

        console.log(`Player disconnected: ${JSON.stringify(player)}`);
    }

    onCommand(conn: ActiveConnection, cmd: string, payload: any) {
        const player = this.connectedPlayers.get(conn.socket.id);

        console.log(`Received command ${cmd} from player: ${JSON.stringify(player)}`);
    }

    onGameFinished() {
        this.networkServer.terminate()
            .then(() => console.log("The game-server has finished"))
    }
}
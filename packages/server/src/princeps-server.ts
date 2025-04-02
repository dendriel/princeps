import mogs, {ActiveConnection, GameServer, NetworkServer, ConnectionInfo} from "rozsa-mogs";
import {Player} from "./player.js";
import {PrincepsConnectionInfo} from "./princeps-connection-info.js";

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

        // TODO: testing purpose-only.
        this.networkServer.addExpectedConnection(new PrincepsConnectionInfo(conn.info.token()));

        console.log(`Player connected: ${JSON.stringify(newPlayer.info)}`);

        this.networkServer.send(newPlayer.token, "LOAD_MAP", { boardSize: { w: 4, h: 4 }});
    }

    onDisconnection(conn: ActiveConnection) {
        const player = this.connectedPlayers.get(conn.socket.id);
        if (!player) {
            console.log(`Unknown player has disconnected. SocketId: ${conn.socket.id}`);
            return;
        }

        console.log(`Player disconnected: ${JSON.stringify(player.info)}`);
    }

    onCommand(conn: ActiveConnection, cmd: string, payload: any) {
        const player = this.connectedPlayers.get(conn.socket.id);
        if (!player) {
            console.log(`Command received from unknown player. Ignoring... SocketId: ${conn.socket.id}`);
            return;
        }

        console.log(`Received command ${cmd} from player: ${JSON.stringify(player.info)}`);
    }

    onGameFinished() {
        this.networkServer.terminate()
            .then(() => console.log("The game-server has finished"))
    }
}
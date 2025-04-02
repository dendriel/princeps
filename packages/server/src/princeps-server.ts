import mogs, {ActiveConnection, GameServer, NetworkServer, ConnectionInfo} from "rozsa-mogs";
import {Player} from "./game-server/player.js";
import {PrincepsConnectionInfo} from "./princeps-connection-info.js";
import {Size, LoadGamePayload, ClientCommand} from "../../shared/dist/princeps-shared.js";
import {PlayersHolder} from "./game-server/player-holder.js";
import {CommandDispatcher} from "./commands/command-dispatcher.js";

/**
 * Server provider for Princeps Game.
 */
export class PrincepsServer implements GameServer {
    private readonly networkServer: NetworkServer;
    private readonly playersHolder: PlayersHolder;
    private readonly commandDispatcher: CommandDispatcher;

    private gameStarted: boolean = false;

    constructor() {
        this.networkServer = new mogs.NetworkServer(this);
        this.playersHolder = new PlayersHolder();
        this.commandDispatcher = new CommandDispatcher(this.networkServer);
    }

    start() {
        this.networkServer.listen();
    }

    addExpectedPlayer(connInfo: ConnectionInfo) {
        this.networkServer.addExpectedConnection(connInfo);
        this.playersHolder.add(new Player(connInfo))
    }

    onConnection(conn: ActiveConnection) {
        const player = this.playersHolder.addConnectionInfo(conn);
        if (!player) {
            return;
        }

        console.log(`Player connected: ${JSON.stringify(player.connInfo)}`);

        // TODO: testing purpose-only.
        this.networkServer.addExpectedConnection(new PrincepsConnectionInfo(conn.info.token()));

        if (!this.gameStarted) {
            if (this.playersHolder.allPlayersAlreadyConnected()) {
                this.startGame();
            }
        }
        else {
            // TODO: load current game state
        }
    }

    onDisconnection(conn: ActiveConnection) {
        const player = this.playersHolder.removeConnectionInfo(conn);
        if (!player) {
            console.log(`Unknown player has disconnected. SocketId: ${conn.socket.id}, Token: ${conn.info.token()}`);
            return;
        }

        console.log(`Player disconnected: ${JSON.stringify(player.connInfo)}`);
    }

    onCommand(conn: ActiveConnection, cmd: string, payload: any) {
        const player = this.playersHolder.get(conn);
        if (!player) {
            console.log(`Command received from unknown player. Ignoring... SocketId: ${conn.socket.id}`);
            return;
        }

        // TODO: add a command handler.

        console.log(`Received command ${cmd} from player: ${JSON.stringify(player.connInfo)}`);
    }

    onGameFinished() {
        this.networkServer.terminate()
            .then(() => console.log("The game-server has finished"))
    }

    private startGame() {
        if (this.gameStarted) {
            return;
        }

        this.gameStarted = true;

        this.commandDispatcher.broadcastloadMap(Size.of(4, 4));

        const currPlayerTurn = this.playersHolder.getCurrentPlayerToPlay();
        this.commandDispatcher.activatePlayerTurn(currPlayerTurn);
    }
}
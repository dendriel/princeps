import mogs, {ActiveConnection, GameServer, NetworkServer, ConnectionInfo} from "rozsa-mogs";
import {Player} from "./game-server/player.js";
import {PrincepsConnectionInfo} from "./princeps-connection-info.js";
import {ServerCommand} from "../../shared/dist/princeps-shared.js";
import {PlayersHolder} from "./game-server/player-holder.js";
import {CommandDispatcher} from "./commands/command-dispatcher.js";
import {SelectCard} from "./command-handler/select-card.js";
import {ServerCommandHandler} from "./commands/server-command-handler.js";
import {MatchGenerator} from "./game-server/match-generator.js";
import {ConfigLoader, ServerConfig} from "./config-loader.js";
import {MatchHandler} from "./game-server/match-handler.js";
import {UpdateNickname} from "./command-handler/update-nickname.js";

/**
 * Server provider for Princeps Game.
 */
export class PrincepsServer implements GameServer {
    private readonly config: ServerConfig;
    private readonly networkServer: NetworkServer;
    private readonly playersHolder: PlayersHolder;
    private readonly commandDispatcher: CommandDispatcher;
    private readonly matchGenerator: MatchGenerator;

    private readonly matchHandler: MatchHandler;

    private readonly commandsHandler: Map<ServerCommand, ServerCommandHandler>;

    private gameStarted: boolean = false;

    constructor() {

        this.config = ConfigLoader.load('./resources/server-config.json');

        this.networkServer = new mogs.NetworkServer(this);
        this.playersHolder = new PlayersHolder();
        this.commandDispatcher = new CommandDispatcher(this.networkServer, this.playersHolder);
        this.matchGenerator = new MatchGenerator(this.config.cards);
        this.matchHandler = new MatchHandler();
        this.commandsHandler = new Map<ServerCommand, ServerCommandHandler>();

        this.setupCommandHandlers();
    }

    private setupCommandHandlers() {
        this.commandsHandler.set(ServerCommand.SELECT_CARD, new SelectCard(this.commandDispatcher, this.matchHandler, this.playersHolder));
        this.commandsHandler.set(ServerCommand.UPDATE_NICKNAME, new UpdateNickname(this.commandDispatcher, this.matchHandler, this.playersHolder));
    }

    start(matchSize: number) {
        const matchCards = this.matchGenerator.generate(matchSize);
        this.matchHandler.setup(matchCards);

        console.log(`Match cards:`);
        for (let i = 0; i < matchCards.length; i++) {
            process.stdout.write(`${matchCards[i]}, `);
            if (i % 4 === 0) {
                console.log('\n')
            }
        }

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

        // Read the player to expected connections, so he can reload the match.
        // In the other hand, it allows multiple connections with the same token.
        this.networkServer.addExpectedConnection(new PrincepsConnectionInfo(conn.info.token()));

        if (!this.gameStarted) {
            if (this.playersHolder.allPlayersAlreadyConnected()) {
                this.startGame();
            }
        }
        else {
            this.loadGameState(player);
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

    async onCommand(conn: ActiveConnection, cmd: string, payload: any) {
        const player = this.playersHolder.get(conn);
        if (!player) {
            console.log(`Command received from unknown player. Ignoring... SocketId: ${conn.socket.id}`);
            return;
        }

        const serverCmd = cmd as ServerCommand;
        const handler = this.commandsHandler.get(serverCmd);
        if (!handler) {
            console.log(`Unhandled command ${cmd} received from client ${JSON.stringify(player.connInfo)}`)
            return;
        }

        if (handler.requirePlayerTurn() && !this.playersHolder.isPlayerTurn(player)) {
            console.log(`Received command '${cmd}' but it is not the player's turn.  ${JSON.stringify(player.connInfo)}`)
            return;
        }

        await handler.execute(player, payload);
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

        this.commandDispatcher.broadcastLoadGame(this.matchHandler.boardSize);

        const currPlayerTurn = this.playersHolder.getCurrentPlayerToPlay();
        this.commandDispatcher.activatePlayerTurn(currPlayerTurn);
    }

    private loadGameState(player: Player) {
        const openCards = this.matchHandler.getOpenCards();
        this.commandDispatcher.loadGameState(player, this.matchHandler.boardSize, openCards);

        const currentPlayerToPlay = this.playersHolder.getCurrentPlayerToPlay();
        if (currentPlayerToPlay.sameAs(player)) {
            this.commandDispatcher.activatePlayerTurn(player);
        }
    }
}
import {GameController} from "./game/game-controller.js";
import GameConfig from "./game/game-config.js";
import mogs, { NetworkClient } from "rozsa-mogs-client";
import {PrincepsGameClient} from "./game-client/princeps-game-client.js";
import {CommandDispatcher} from "./game-client/commands/command-dispatcher.js";

export class Princeps {

    private gameCtrl: GameController | undefined;

    private networkClient: NetworkClient | undefined;

    private gameClient: PrincepsGameClient | undefined;

    private commandsDispatcher: CommandDispatcher | undefined;

    async start(port: number) {
        console.log("Loading the game...");

        // This kind of loading isn't very helpful because the type is not available in runtime.
        const config: GameConfig = await this.loadConfig();

        const nickname = this.getNickname();
        this.gameCtrl = new GameController(config, nickname);
        this.gameCtrl.addBoardReadyListener(this.onGameBoardReady.bind(this));

        this.gameClient = new PrincepsGameClient(this.gameCtrl);
        this.networkClient = new mogs.NetworkClient(this.gameClient, `//localhost:${port}/`);

        this.commandsDispatcher = new CommandDispatcher(this.networkClient);
        this.gameClient.setDispatcher(this.commandsDispatcher);

        // TODO: receive all params in the constructor.
        const token = this.getToken();
        this.networkClient.connect({ connectionToken: token, connectionId: this.getPlayerId(), extraParams: this.getConnectionParams() });

        console.log("Game started!");
    }

    private getToken(): string | undefined {
        return localStorage.getItem('princeps_token') ?? undefined;
    }

    private getNickname(): string {
        return localStorage.getItem('princeps_nickname') ?? 'Anom';
    }

    private getPlayerId(): string {
        return localStorage.getItem('princeps_id')!;
    }

    private getConnectionParams(): Map<string, string> {
        const params = new Map<string, string>();
        params.set('nickname', this.getNickname());
        params.set('player_id', this.getPlayerId());
        return params;
    }

    async loadConfig(): Promise<GameConfig> {
        const response = await fetch('./config.json');
        const config = await response.json();
        console.log(config.someKey);
        return config;
    }

    private onGameBoardReady() {
        this.commandsDispatcher!.updateNickname(this.getNickname());
    }
}
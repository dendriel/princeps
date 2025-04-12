import {GameController} from "./game/game-controller.js";
import GameConfig from "./game/game-config.js";
import mogs, { NetworkClient } from "rozsa-mogs-client";
import {PrincepsGameClient} from "./game-client/princeps-game-client.js";
import {CommandDispatcher} from "./game-client/commands/command-dispatcher.js";

export class Princeps {

    private gameCtrl: GameController | undefined;

    private networkClient: NetworkClient | undefined;

    private gameClient: PrincepsGameClient | undefined;

    async start() {
        console.log("Loading the game...");

        // This kind of loading isn't very helpful because the type is not available in runtime.
        const config: GameConfig = await this.loadConfig();

        this.gameCtrl = new GameController(config);

        this.gameClient = new PrincepsGameClient(this.gameCtrl);

        const token = this.getToken();

        this.networkClient = new mogs.NetworkClient(this.gameClient, '//localhost:8090/');

        const commandsDispatcher = new CommandDispatcher(this.networkClient);
        this.gameClient.setDispatcher(commandsDispatcher);

        this.networkClient.connect(token);

        console.log("Game started!");
    }

    private getToken(): string | undefined {
        return localStorage.getItem('princeps_token') ?? undefined;
    }

    async loadConfig(): Promise<GameConfig> {
        const response = await fetch('./config.json');
        const config = await response.json();
        console.log(config.someKey);
        return config;
    }
}
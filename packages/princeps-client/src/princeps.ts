import {GameController} from "./game/game-controller.js";
import GameConfig from "./game/game-config.js";
import mogs, { NetworkClient } from "rozsa-mogs-client";
import {PrincepsGameClient} from "./game-client/princeps-game-client.js";

export class Princeps {

    private gameCtrl: GameController | undefined;

    private networkClient: NetworkClient | undefined;

    private gameClient: PrincepsGameClient | undefined;

    async start() {
        console.log("Loading the game...");

        const config = await this.loadConfig(); // TODO: create class
        this.gameCtrl = new GameController(config);

        this.gameClient = new PrincepsGameClient(this.gameCtrl);

        this.networkClient = new mogs.NetworkClient(this.gameClient, '//localhost:8090/');
        this.networkClient.connect("ABCD");

        console.log("Game started!");
    }

    async loadConfig(): Promise<GameConfig> {
        const response = await fetch('./config.json');
        const config = await response.json();
        console.log(config.someKey);
        return config;
    }
}
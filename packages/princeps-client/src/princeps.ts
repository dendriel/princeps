import {GameController} from "./game-controller.js";
import GameConfig from "./game-config.js";
import mogs, { GameClient, NetworkClient } from "rozsa-mogs-client";

export class Princeps implements GameClient {

    private gameCtrl: GameController | undefined;

    private networkClient: NetworkClient | undefined;

    async start() {
        console.log("Loading the game...");

        const config = await this.loadConfig(); // TODO: create class
        this.gameCtrl = new GameController(config);

        this.networkClient = new mogs.NetworkClient(this, '//localhost:8090/');
        this.networkClient.connect("ABCD");

        console.log("Game started!");
    }

    async loadConfig(): Promise<GameConfig> {
        const response = await fetch('./config.json');
        const config = await response.json();
        console.log(config.someKey);
        return config;
    }

    onCommand(cmd: string, payload: any) {
        console.log(`Command received! cmd: ${cmd} payload: ${payload}`)
    }

    onDisconnection(reason: string) {
        console.log(`Disconnected from server ${reason}`)
    }

    onConnectError(error: Error) {
        console.log(`Connection error ${JSON.stringify(error)}`)

    }
}
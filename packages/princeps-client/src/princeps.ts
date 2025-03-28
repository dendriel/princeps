import {GameController} from "./game-controller.js";
import GameConfig from "./game-config.js";

export class Princeps {

    gameCtrl: GameController | undefined;

    async start() {
        console.log("Loading the game...");

        const config = await this.loadConfig(); // TODO: create class
        this.gameCtrl = new GameController(config);

        console.log("Game started!");
    }

    async loadConfig(): Promise<GameConfig> {
        const response = await fetch('./config.json');
        const config = await response.json();
        console.log(config.someKey);
        return config;
    }
}
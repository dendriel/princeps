import {CommandHandler} from "./command-handler.js";
import {GameController} from "../../game/game-controller.js";
import {Size} from "../../game/size.js";


export class LoadMap implements CommandHandler {

    constructor(private gameCtrl: GameController) {}


    execute(payload: unknown) {
        console.log(`Handling LOAD_MAP command`);

        this.gameCtrl.startGame(payload as Size);
    }
}
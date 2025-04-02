import {CommandHandler} from "./command-handler.js";
import {GameController} from "../../game/game-controller.js";
import {Size, LoadGamePayload} from "../../../../shared/dist/princeps-shared.js"


export class LoadMap implements CommandHandler {

    constructor(private gameCtrl: GameController) {}


    execute(payload: unknown) {
        const loadMapPayload = payload as LoadGamePayload;
        console.log(`Handling LOAD_MAP command`);

        const xpto = Size.of(4, 4);
        console.log(`SIZE: ${JSON.stringify(xpto)}`);

        this.gameCtrl.startGame(loadMapPayload.boardSize);
    }
}
import {GameController} from "../../game/game-controller.js";
import {LoadGamePayload, ClientCommand} from "../../../../shared/dist/princeps-shared.js"
import {AbstractCommandHandler} from "./abstract-command-handler.js";


export class LoadGame extends AbstractCommandHandler<LoadGamePayload> {

    constructor(private gameCtrl: GameController) {
        super(ClientCommand.LOAD_GAME);
    }

    handleCommand(payload: LoadGamePayload) {
        this.gameCtrl.startGame(payload.boardSize);
    }
}
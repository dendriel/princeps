import {GameController} from "../../game/game-controller.js";
import {LoadGamePayload, ClientCommand, AbstractCommandHandler} from "../../../../shared/dist/princeps-shared.js"


export class LoadGame extends AbstractCommandHandler<LoadGamePayload, ClientCommand> {

    constructor(private gameCtrl: GameController) {
        super(ClientCommand.LOAD_GAME);
    }

    handleCommand(payload: LoadGamePayload) {
        this.gameCtrl.startGame(payload.boardSize, payload.openCards);
    }
}
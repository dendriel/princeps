import {AbstractCommandHandler, ClientCommand, FinishGamePayload} from "../../../../shared/dist/princeps-shared.js";
import {GameController} from "../../game/game-controller.js";

export class FinishGame extends AbstractCommandHandler<FinishGamePayload, ClientCommand> {

    constructor(private gameCtrl: GameController) {
        super(ClientCommand.FINISH_GAME);
    }

    handleCommand(payload: FinishGamePayload): void {
        this.gameCtrl.finishGame(payload.gameOverMsg);
    }
}
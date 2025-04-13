import {GameController} from "../../game/game-controller.js";
import {UpdateScorePayload, ClientCommand, AbstractCommandHandler} from "../../../../shared/dist/princeps-shared.js"

export class UpdateScore extends AbstractCommandHandler<UpdateScorePayload, ClientCommand> {

    constructor(private gameCtrl: GameController) {
        super(ClientCommand.UPDATE_SCORE);
    }

    handleCommand(payload: UpdateScorePayload): void {
        this.gameCtrl.updateScore(payload.scores);
    }
}
import {GameController} from "../../game/game-controller.js";
import {AbstractCommandHandler, ClientCommand} from "../../../../shared/dist/princeps-shared.js";

export class DeactivateTurn extends AbstractCommandHandler<void, ClientCommand> {

    constructor(private gameCtrl: GameController) {
        super(ClientCommand.DEACTIVATE_TURN);
    }

    handleCommand(_: void) {
        this.gameCtrl.deactivateController();
    }
}
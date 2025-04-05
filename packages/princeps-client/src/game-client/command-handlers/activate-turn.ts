import {GameController} from "../../game/game-controller.js";
import {AbstractCommandHandler, ClientCommand} from "../../../../shared/dist/princeps-shared.js";

export class ActivateTurn extends AbstractCommandHandler<void, ClientCommand> {

    constructor(private gameCtrl: GameController) {
        super(ClientCommand.ACTIVATE_TURN);
    }

    handleCommand(_: void) {
        this.gameCtrl.activateController();
    }
}
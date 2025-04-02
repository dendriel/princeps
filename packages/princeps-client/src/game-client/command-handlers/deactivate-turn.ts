import {AbstractCommandHandler} from "./abstract-command-handler.js";
import {GameController} from "../../game/game-controller.js";
import {ClientCommand} from "../../../../shared/dist/client-command.js";

export class DeactivateTurn extends AbstractCommandHandler<void> {

    constructor(private gameCtrl: GameController) {
        super(ClientCommand.DEACTIVATE_TURN);
    }

    handleCommand(_: void) {
        this.gameCtrl.deactivateController();
    }
}
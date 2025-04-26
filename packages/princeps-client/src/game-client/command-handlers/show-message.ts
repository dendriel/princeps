import {AbstractCommandHandler, ClientCommand, ShowMessagePayload} from "../../../../shared/dist/princeps-shared.js";
import {GameController} from "../../game/game-controller.js";


export class ShowMessage extends AbstractCommandHandler<ShowMessagePayload, ClientCommand> {

    constructor(private gameCtrl: GameController) {
        super(ClientCommand.SHOW_MESSAGE);
    }
    handleCommand(payload: ShowMessagePayload): void {
        this.gameCtrl.showMessage(payload.text);
    }
}
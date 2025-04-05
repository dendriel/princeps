
import {AbstractCommandHandler, CardInfoPayload, ClientCommand} from "../../../../shared/dist/princeps-shared.js";
import {GameController} from "../../game/game-controller.js";


export class ShowCard extends AbstractCommandHandler<CardInfoPayload, ClientCommand> {

    constructor(private gameCtrl: GameController) {
        super(ClientCommand.SHOW_CARD);
    }

    handleCommand(cardInfo: CardInfoPayload) {
        this.gameCtrl.showCard(cardInfo.pos, cardInfo.name);
    }
}
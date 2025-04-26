import {AbstractCommandHandler, CardInfoPayload, ClientCommand, CardsInfoPayload} from "../../../../shared/dist/princeps-shared.js";
import {GameController} from "../../game/game-controller.js";


export class HideCards extends AbstractCommandHandler<CardsInfoPayload, ClientCommand> {

    constructor(private gameCtrl: GameController) {
        super(ClientCommand.HIDE_CARDS);
    }

    handleCommand(payload: CardsInfoPayload) {
        if (payload.cardsInfo.length === 0) {
            this.gameCtrl.hideAllCards();
            return;
        }

        payload.cardsInfo.forEach((card: CardInfoPayload) => {
            this.gameCtrl.hideCard(card.pos);
        });
    }
}
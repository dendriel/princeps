import {CardInfoPayload} from "./card-info-payload.js";

export class CardsInfoPayload {
    constructor(public cardsInfo: CardInfoPayload[] = []) {}

    addCardInfo(cardInfo: CardInfoPayload): CardsInfoPayload {
        this.cardsInfo.push(cardInfo);
        return this;
    }
}
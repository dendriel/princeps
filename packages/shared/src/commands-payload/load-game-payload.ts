import {CardsInfoPayload} from "./cards-info-payload.js";

export class LoadGamePayload {
    constructor(
        public boardSize: number,
        public openCards: CardsInfoPayload = new CardsInfoPayload(),
        public chatHistory: string[] = []
        ) {}
}
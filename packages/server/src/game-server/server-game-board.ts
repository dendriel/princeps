
class ServerCard {
    constructor(private _id: string) {
    }

    get id(): string {
        return this._id;
    }
}

export class ServerGameBoard {

    private cards: Map<String, ServerCard>;

    constructor() {
        this.cards = new Map<String, ServerCard>();
    }
}
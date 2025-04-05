
class Card {
    constructor(
        private _name: string,
        private _pos: number,
        private _isOpen: boolean = false
    ) {}

    get name(): string {
        return this._name;
    }

    get pos(): number {
        return this._pos;
    }

    get isOpen(): boolean {
        return this._isOpen;
    }

    set isOpen(value: boolean) {
        this._isOpen = value;
    }

    equalsTo(card: Card) {
        return this.name === card.name;
    }
}

export class MatchHandler {

    private readonly matchCards: Card[];
    private readonly guessedCards: Card[];

    private isPlayerGuessing: boolean;

    constructor() {
        this.matchCards = [];
        this.guessedCards = [];
        this.isPlayerGuessing = false;
    }

    get boardSize(): number {
        return this.matchCards.length;
    }

    setup(matchCards: string[]) {
        for (let i = 0; i < matchCards.length; i++) {
            const name = matchCards.at(i)!;
            this.matchCards.push(new Card(name, i));
        }
    }

    lockPlayerGuessing(): boolean {
        if (this.isPlayerGuessing) {
            return false;
        }

        this.isPlayerGuessing = true;
        return true;
    }

    unlockPlayerGuessing() {
        this.isPlayerGuessing = false;
    }

    /**
     * Open a cards.
     * @return true if the card was open; false if the card was already open.
     */
    openCard(index: number): boolean {
        if (index < 0 || index >= this.matchCards.length) {
            console.log(`Invalid card index: ${index}`);
            return false;
        }

        const card = this.matchCards.at(index)!;
        if (card.isOpen) {
            console.log(`Card ${card.name} at index: ${index} was already open.`);
            return false;
        }

        card.isOpen = true;
        this.guessedCards.push(card);

        return true;
    }

    getCardName(index: number): string {
        return this.matchCards.at(index)!.name;
    }

    /**
     * All cards matched if there is no card still closed.
     */
    allCardsMatched(): boolean {
        return this.matchCards.find((card: Card) => !card.isOpen) !== undefined;
    }

    pairIsOpen(): boolean {
        return this.guessedCards.length === 2;
    }

    pairIsMatch(): boolean {
        if (!this.pairIsOpen()) {
            console.log(`Checking if the pair match but there is ${this.guessedCards.length} open right now.`)
            return false;
        }

        return this.guessedCards[0].equalsTo(this.guessedCards[1]);
    }

    getGuessedCardsIndexes(): number[] {
        return this.guessedCards.map(card => card.pos);
    }

    clearGuessedCards(closeCards: boolean = false) {
        if (closeCards) {
            this.guessedCards.forEach(card => card.isOpen = false);
        }
        this.guessedCards.length = 0;
    }
}
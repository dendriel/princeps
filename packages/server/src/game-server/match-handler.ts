
class Card {
    constructor(private _name: string, private _isOpen: boolean = false) {}


    get name(): string {
        return this._name;
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

    constructor() {
        this.matchCards = [];
        this.guessedCards = [];
    }

    get boardSize(): number {
        return this.matchCards.length;
    }

    setup(matchCards: string[]) {
        matchCards.forEach(name => {
            this.matchCards.push(new Card(name));
        });
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

    clearGuessedCards(closeCards: boolean = false) {
        if (closeCards) {
            this.guessedCards.forEach(card => card.isOpen = false);
        }
        this.guessedCards.length = 0;
    }
}
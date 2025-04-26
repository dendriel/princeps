import {MatchGenerator} from "./match-generator.js";

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

export class OpenCard {
    constructor(public pos: number, public name: string) {}
}

export class MatchHandler {

    private readonly matchCards: Card[];
    private readonly guessedCards: Card[];

    private isPlayerGuessing: boolean;

    private _currRound: number = 0;

    private _matchSize: number = 0;
    private _totalRounds: number = 0;

    constructor(
        private matchGenerator: MatchGenerator,
    ) {
        this.matchCards = [];
        this.guessedCards = [];
        this.isPlayerGuessing = false;
    }

    get boardSize(): number {
        return this.matchCards.length;
    }

    isMatchFinished(): boolean {
        return this._currRound >= this._totalRounds;
    }

    get matchSize(): number {
        return this._matchSize;
    }

    get currRound(): number {
        return this._currRound;
    }

    setup(matchSize: number, rounds: number) {
        this._matchSize = matchSize;
        this._totalRounds = rounds;
    }

    newRound() {
        if (this._matchSize === 0) {
            console.log("Match size not defined!");
            return;
        }

        this.clearMatchCards();

        const cards = this.matchGenerator.generate(this._matchSize);

        for (let i = 0; i < cards.length; i++) {
            const name = cards.at(i)!;
            this.matchCards.push(new Card(name, i));
        }

        this._currRound++;
    }

    private clearMatchCards() {
        this.clearGuessedCards();
        this.matchCards.length = 0;
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
        // console.log(`MATCH TEST: ${JSON.stringify(this.matchCards.find(c => !c.isOpen))}`);
        return !(this.matchCards.find(c => !c.isOpen));
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

    getOpenCards(): OpenCard[] {
        let openCards = this.matchCards
            .filter(c => c.isOpen)
            .map(c => new OpenCard(c.pos, c.name))

        for (const guessed of this.guessedCards) {
            openCards.push(new OpenCard(guessed.pos, guessed.name));
        }

        return openCards;
    }

    clearGuessedCards(closeCards: boolean = false) {
        if (closeCards) {
            this.guessedCards.forEach(card => card.isOpen = false);
        }
        this.guessedCards.length = 0;
    }

    // debug only
    printMatchCards() {
        console.log(`Match cards:`);
        for (let i = 0; i < this.matchCards.length; i++) {
            process.stdout.write(`${this.matchCards[i].name}(${this.matchCards[i].isOpen}), `);
            if ((i+1) % 4 === 0) {
                console.log('\n')
            }
        }
        console.log('\n')
    }
}
export class MatchGenerator {

    constructor(private availableCards: string[]) {
    }

    generate(size: number): string[] {
        if (size % 2 !== 0) {
            throw new Error(`Invalid count of cards ${size}. It must be an even number.`)
        }

        const targetUniqueCards = size / 2;
        if (targetUniqueCards > this.availableCards.length) {
            throw new Error(`There is not enough unique cards to create a match of ${size} cards.`)
        }

        const selectedCards : Set<string> = new Set<string>();
        do {
            const randomCard = this.pickRandomCard();
            selectedCards.add(randomCard);
        } while (selectedCards.size < targetUniqueCards);

        let match = [...selectedCards];
        match.push(...match);

        // TODO: reactivate
        match = this.shuffle(match);

        return match;
    }

    shuffle(cards: string[]): string[] {
        const result = [...cards];
        result.sort(() => Math.random() - 0.5);
        return result;
    }

    private pickRandomCard(): string {
        const idx = Math.floor(Math.random() * this.availableCards.length);
        return this.availableCards[idx];
    }
}
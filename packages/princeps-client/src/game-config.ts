import {Size} from "./size.js";
import {GameBoard} from "./game-board.js";


export class CardConfig {
    constructor(public key: string, public name: string, public image: string) {}
}

export class GameControllerConfig {
    constructor(
        // Use any because when running Javascript the config fetch won't ensure the type.
        // Could have created an object to map all fields.
        public cardsTemplate: any //Map<String, CardConfig>
    ) {}
}

export class CardDimensions {
    constructor(
        public size: Size,
        public betweenOffset: Size,
        public borderOffset: Size
    ) {}
}

export class GameBoardConfig {
    constructor(
        public size: Size,
        public card: CardDimensions,
        public hiddenCardKey: string,
        public images: [string, string][]
    ) {
    }
}

export default class GameConfig {

    constructor(
        public phaser:  Phaser.Types.Core.GameConfig,
        public gameController: GameControllerConfig,
        public gameBoard: GameBoard
        ) {
    }
}
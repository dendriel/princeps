import {Size} from "../../../shared/dist/princeps-shared.js"
import {Position} from "@rozsa/shared";

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
        public openCardKey: string,
        public images: [string, string][],
        public ui: GameBoardUi
    ) {
    }
}

export class GameBoardUi {
    constructor(
        public playerScoreText: GameText
    ) {}
}

export class GameText {
    constructor(
        public text: string,
        public offset: Position,
        public style: GameTextStyle
    ) {}
}

export class GameTextStyle {
    constructor(
        public font: string,
        public fill: string,
        public stroke: string,
        public strokeThickness: number,
        public align: string
    ) {}
}

export default class GameConfig {

    constructor(
        public phaser:  Phaser.Types.Core.GameConfig,
        public gameController: GameControllerConfig,
        public gameBoard: GameBoardConfig
        ) {
    }
}
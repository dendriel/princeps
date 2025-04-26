import {Size, Position} from "../../../shared/dist/princeps-shared.js"

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
        public scoreboards: number,
        public offsetBetweenScores: Position,
        public playerScoreText: GameText,
        public infoText: GameText
    ) {}
}

export class GameText {
    constructor(
        public text: string,
        public offset: Position,
        public style: GameTextStyle
    ) {}

    copy(): GameText {
        return new GameText(
            this.text,
            this.offset.copy(),
            this.style.copy()
        )
    }

    static cast(value: GameText): GameText {
        return new GameText(
            value.text,
            Position.ofPosition(value.offset),
            GameTextStyle.of(value.style)
        );
    }
}

export class GameTextStyle {
    constructor(
        public font: string,
        public fill: string,
        public stroke: string,
        public strokeThickness: number,
        public align: string
    ) {}

    copy(): GameTextStyle {
        return new GameTextStyle(
            this.font,
            this.fill,
            this.stroke,
            this.strokeThickness,
            this.align
        )
    }

    static of(style: GameTextStyle): GameTextStyle {
        return new GameTextStyle(
            style.font,
            style.fill,
            style.stroke,
            style.strokeThickness,
            style.align
        );
    }
}

export default class GameConfig {

    constructor(
        public phaser:  Phaser.Types.Core.GameConfig,
        public gameController: GameControllerConfig,
        public gameBoard: GameBoardConfig
        ) {}
}
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

export class CardProperties {
    constructor(
        // Count of cols and rows in the board.
        public dimension: Size,
        public size: Size,
        public betweenOffset: Size,
        public borderOffset: Size,
        public labelText: GameText
    ) {}
}

export class GameBoardConfig {
    constructor(
        public size: Size,
        public cardsProperties: Map<string, CardProperties>,
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
        public chatManager: ChatManagerConfig
    ) {}
}

export class ChatManagerConfig {
    constructor(
        public scrollFactor: number,
        public startingScroll: number,
        public maxLineChars: number,
        public textArea: TextAreaConfig
    ) {
    }
}

export class TextAreaConfig {
    constructor(
        public offset: Position,
        public size: Size,
        public bg: ColorConfig,
        public textOffset: Position,
        public textStyle: GameTextStyle
    ) {
    }
}

export class ColorConfig {
    constructor(
        public alpha: number,
        public fill: string
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
import Layer = Phaser.GameObjects.Layer;
import {GameBoardUi, GameText} from "./game-config.js";
import * as Phaser from "phaser";
import {GameBoard} from "./game-board.js";
import {Position} from "../../../shared/dist/princeps-shared.js"

class PlayerScore {
    constructor(private nickname: string, private score: number, private text: Phaser.GameObjects.Text) {}

    updateScore(value: number) {
        this.score = value;
        this.text.text = `${this.nickname}\n${this.score} Pts`
    }
}

// TODO: change players score colors!

export class UiBoard {

    private uiAboveLayer: Layer | undefined;

    private scoreTexts: PlayerScore[] = [];

    constructor(private board: GameBoard, private uiConfig: GameBoardUi) {}

    setup() {
        this.uiAboveLayer = this.board.newLayer();
        this.uiAboveLayer.setDepth(950);

        const offsetBetweenScores = this.uiConfig.offsetBetweenScores;
        const scoreTextTemplate = GameText.cast(this.uiConfig.playerScoreText);


        for (let i = 0; i < this.uiConfig.scoreboards; i++) {
            const nickTextConfig = scoreTextTemplate.copy();

            const offset = new Position(offsetBetweenScores.x * i, offsetBetweenScores.y * i);

            nickTextConfig.offset.addOffset(offset);
            const text = this.createScreenText(nickTextConfig);
            const playerScore = new PlayerScore("", 0, text);
            this.scoreTexts.push(playerScore);
        }
    }

    createScreenText(data: GameText) : Phaser.GameObjects.Text {
        let text = this.board.addText(data.offset.x, data.offset.y, data.text, data.style);
        text.setScrollFactor(0);
        this.uiAboveLayer!.add(text);
        return text;
    }
}
import Layer = Phaser.GameObjects.Layer;
import {GameBoardUi, GameText} from "./game-config.js";
import * as Phaser from "phaser";
import {GameBoard} from "./game-board.js";
import {Position} from "../../../shared/dist/princeps-shared.js"
import {ChatManager} from "../components/ChatManager.js";

class PlayerScore {
    constructor(private nickname: string, private score: number, private text: Phaser.GameObjects.Text) {}

    updateScore(nickname: string, score: number) {
        this.nickname = nickname;
        this.score = score;
        this.text.text = `${this.nickname}\n${this.score} Pts`

        this.text.visible = true;
    }
}

// TODO: change players score colors!

export class GameUi {

    private uiAboveLayer: Layer | undefined;

    private scoreTexts: PlayerScore[] = [];

    private chatManager: ChatManager;

    constructor(private board: GameBoard, private uiConfig: GameBoardUi) {
        this.chatManager = new ChatManager(this.uiConfig.chatManager);
    }

    updateScoreTexts(playerNickname: string, scores: [string, number][]) {
        const playerScore = scores.find(s => s[0] === playerNickname);
        const otherScores = scores.filter(s => s[0] !== playerNickname);

        if (playerScore) {
            this.updateScoreText(playerScore[0], playerScore[1], 0);
        }

        for (let i = 0; i < otherScores.length && i < this.scoreTexts.length; i++) {
            const score = otherScores[i];
            // start at the next position because index 0 is always the local player.
            this.updateScoreText(score[0], score[1], (i+1));
        }
    }

    updateScoreText(nickname: string, score: number, index: number) {
        if (index >= this.scoreTexts.length) {
            console.log(`Invalid score UI index: '%d'`, index);
            return;
        }

        this.scoreTexts[index].updateScore(nickname, score);
    }

    appendChatText(text: string) {
        this.chatManager?.appendText(text);
    }

    setup() {
        this.uiAboveLayer = this.board.newLayer();
        this.uiAboveLayer.setDepth(950);

        this.createPlayerScores();

        this.chatManager.setup(this.board);
    }

    createPlayerScores() {
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
        text.visible = false;
        this.uiAboveLayer!.add(text);
        return text;
    }
}
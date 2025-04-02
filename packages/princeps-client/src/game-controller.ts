import * as Phaser from "phaser";
import {GameBoard} from "./game-board.js";
import {PointerEventContext} from "./game-object.js";
import GameConfig, {GameControllerConfig} from "./game-config.js";
import {Position} from "./position.js";
import {Card} from "./game/card.js";

export class GameController extends Phaser.Game {
    private static mainSceneKey: string = 'Main';

    private readonly gameBoard: GameBoard;

    private readonly configCtrl: GameControllerConfig;

    // TODO: testing purpose only
    private readonly cardsPositions: string[][] = [
        ["archers",      "horses",        "militia",      "knight"],
        ["javelineers", "castle",         "javelineers", "archery_range"],
        ["horses",      "knight",         "manatarms",   "manatarms"],
        ["militia",      "archery_range", "archers",      "castle"]
    ]

    constructor(config: GameConfig) {
        super(config.phaser);

        this.configCtrl = config.gameController;
        this.gameBoard = new GameBoard(config.gameBoard, GameController.mainSceneKey, this.configCtrl.cardsTemplate);

        this.setup();
    }

    private setup() {
        this.gameBoard.addOnSceneReadyListener(this.onGameBoardReady.bind(this));

        this.scene.add(GameController.mainSceneKey, this.gameBoard);
        this.scene.start(GameController.mainSceneKey);
    }


    private onGameBoardReady() {
        this.gameBoard.addCardClickedListener(this.cardClickedListener.bind(this));
    }

    private cardClickedListener(context: PointerEventContext) {
        const card = context.target as Card;
        const cardInPos = this.getCardAtBoardPos(card.boardPos)
        console.log(`Card clicked! ${JSON.stringify(card)}, ${JSON.stringify(cardInPos)}`);

        if (card.isVisible) {
            this.gameBoard.hideCard(card.boardPos);
            this.gameBoard.hideAllCards();
        } else {
            this.gameBoard.showCard(card.boardPos, cardInPos);
        }
    }

    private getCardAtBoardPos(pos: Position) : string {
        return this.cardsPositions[pos.x][pos.y];
    }
}
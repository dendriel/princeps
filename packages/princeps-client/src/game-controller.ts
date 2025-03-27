import * as Phaser from "phaser";
import {GameBoard} from "./game-board.js";
import {PointerEventContext} from "./game-object.js";

export class GameController extends Phaser.Game {
    private static mainSceneKey: string = 'Main';

    private readonly gameBoard: GameBoard;

    constructor(config: any) {
        super(config.phaser);

        this.gameBoard = new GameBoard(config.gameBoard, GameController.mainSceneKey);
        this.gameBoard.addOnSceneReadyListener(this.onGameBoardReady.bind(this))
        this.scene.add(GameController.mainSceneKey, this.gameBoard);
        this.scene.start(GameController.mainSceneKey);
    }


    private onGameBoardReady() {
        this.gameBoard.addCardClickedListener(this.cardClickedListener.bind(this));
    }

    private cardClickedListener(context: PointerEventContext) {
        console.log(`Card clicked! ${JSON.stringify(context.target.pos)}`)
    }
}
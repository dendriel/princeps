import * as Phaser from "phaser";
import {GameBoard} from "./game-board.js";

export class GameController extends Phaser.Game {
    private static mainSceneKey: string = 'Main';

    private readonly gameBoard: GameBoard;

    constructor(config: any) {
        super(config.phaser);

        this.gameBoard = new GameBoard(config.gameBoard, GameController.mainSceneKey);
        this.scene.add(GameController.mainSceneKey, this.gameBoard);
        this.scene.start(GameController.mainSceneKey);
    }
}
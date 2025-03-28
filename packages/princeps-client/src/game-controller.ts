import * as Phaser from "phaser";
import {GameBoard} from "./game-board.js";
import {PointerEventContext} from "./game-object.js";
import GameConfig, {GameControllerConfig} from "./game-config.js";

export class GameController extends Phaser.Game {
    private static mainSceneKey: string = 'Main';

    private readonly gameBoard: GameBoard;
    private readonly configCtrl: GameControllerConfig;

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
        console.log(`Card clicked! ${JSON.stringify(context.target.pos)}`);
    }
}
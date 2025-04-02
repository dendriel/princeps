import * as Phaser from "phaser";
import {GameBoard} from "./game-board.js";
import {PointerEventContext} from "./game-object.js";
import GameConfig, {GameControllerConfig} from "./game-config.js";
import {Card} from "./card.js";
import {Size, Position} from "../../../shared/dist/princeps-shared.js"

export interface CardClickedListener {
    (card: Card): void;
}

export class GameController extends Phaser.Game {
    private static mainSceneKey: string = 'Main';

    private gameConfig: GameConfig;

    private _gameBoard: GameBoard | undefined;

    private readonly configCtrl: GameControllerConfig;

    private cardClickedListeners: CardClickedListener[] = [];

    // TODO: testing purpose only
    private readonly cardsPositions: string[][] = [
        ["archers",      "horses",        "militia",      "knight"],
        ["javelineers", "castle",         "javelineers", "archery_range"],
        ["horses",      "knight",         "manatarms",   "manatarms"],
        ["militia",      "archery_range", "archers",      "castle"]
    ]

    private isPlayerTurn: boolean;

    constructor(config: GameConfig) {
        super(config.phaser);
        this.gameConfig = config;
        this.configCtrl = config.gameController;
        this.isPlayerTurn = false;
    }

    private get gameBoard() {
        return this._gameBoard!;
    }

    startGame(boardSize: Size) {
        this._gameBoard = new GameBoard(
            this.gameConfig.gameBoard,
            boardSize,
            GameController.mainSceneKey,
            this.configCtrl.cardsTemplate
        );
        this.gameBoard.addOnSceneReadyListener(this.onGameBoardReady.bind(this));

        this.scene.add(GameController.mainSceneKey, this.gameBoard);
        this.scene.start(GameController.mainSceneKey);
    }

    activateController() {
        this.isPlayerTurn = true;
    }

    deactivateController() {
        this.isPlayerTurn = false;
    }

    private onGameBoardReady() {
        this.gameBoard.addCardClickedListener(this.onCardClicked.bind(this));
    }

    addCardClickedListener(listener: CardClickedListener) {
        this.cardClickedListeners.push(listener);
    }

    private onCardClicked(context: PointerEventContext) {
        if (!this.isPlayerTurn) {
            console.log("Can't select a card. It is not the player's turn.");
            return;
        }

        const card = context.target as Card;
        this.cardClickedListeners.forEach(listener => listener(card));

        // const cardInPos = this.getCardAtBoardPos(card.boardPos)
        // console.log(`Card clicked! ${JSON.stringify(card)}, ${JSON.stringify(cardInPos)}`);

        // if (card.isVisible) {
        //     this.gameBoard.hideCard(card.boardPos);
        //     this.gameBoard.hideAllCards();
        // } else {
        //     this.gameBoard.showCard(card.boardPos, cardInPos);
        // }
    }

    private getCardAtBoardPos(pos: Position) : string {
        return this.cardsPositions[pos.x][pos.y];
    }
}
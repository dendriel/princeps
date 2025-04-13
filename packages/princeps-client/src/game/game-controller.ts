import * as Phaser from "phaser";
import {GameBoard} from "./game-board.js";
import {PointerEventContext} from "./game-object.js";
import GameConfig, {GameControllerConfig} from "./game-config.js";
import {Card} from "./card.js";
import {CardsInfoPayload} from "../../../shared/dist/princeps-shared.js"

interface CardClickedListener {
    (card: Card): void;
}

interface BoardReadListener {
    (): void;
}

export class GameController extends Phaser.Game {
    private static mainSceneKey: string = 'Main';

    private gameConfig: GameConfig;

    private _gameBoard: GameBoard | undefined;

    private readonly configCtrl: GameControllerConfig;

    private cardClickedListeners: CardClickedListener[] = [];
    private boardReadyListeners: BoardReadListener[] = [];

    private openCards: CardsInfoPayload = new CardsInfoPayload();

    private isPlayerTurn: boolean;

    constructor(config: GameConfig, private readonly nickname: string) {
        super(config.phaser);
        this.gameConfig = config;
        this.configCtrl = config.gameController;
        this.isPlayerTurn = false;
    }

    private get gameBoard(): GameBoard {
        return this._gameBoard!;
    }

    /**
     * Draw the game-board and start the game.
     * @param boardSize Game board size to use.
     * @param openCards Already open-cards (when loading an in-progress match).
     */
    startGame(boardSize: number, openCards: CardsInfoPayload) {
        this.openCards = openCards;

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

    showCard(cardPos: number, cardName: string) {
        this._gameBoard?.showCard(cardPos, cardName);
    }

    hideCard(cardPos: number) {
        this._gameBoard?.hideCard(cardPos);
    }

    private onGameBoardReady() {
        this.openCards.cardsInfo.forEach(card => this.gameBoard.showCard(card.pos, card.name));

        this.gameBoard.addCardClickedListener(this.onCardClicked.bind(this));

        this.boardReadyListeners.forEach(l => l());
    }

    addCardClickedListener(listener: CardClickedListener) {
        this.cardClickedListeners.push(listener);
    }

    addBoardReadyListener(listener: BoardReadListener) {
        this.boardReadyListeners.push(listener);
    }

    private onCardClicked(context: PointerEventContext) {
        if (!this.isPlayerTurn) {
            console.log("Can't select a card. It is not the player's turn.");
            return;
        }

        const card = context.target as Card;
        this.cardClickedListeners.forEach(listener => listener(card));
    }

    updateScore(scores: [string, number][]) {
        this.gameBoard.ui.updateScoreTexts(this.nickname, scores);
        console.log(`Received update scores command: ${scores}`);
    }
}
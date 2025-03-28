import * as Phaser from "phaser";
import {Card} from "./game/card.js";
import {Position} from "./position.js";
import {GameObject, PointerEventContext, PointerEventListener} from "./game-object.js";
import {CardConfig, GameBoardConfig} from "./game-config.js";


export class GameBoard extends Phaser.Scene {

    private configBoard: GameBoardConfig;

    private gos: GameObject[];
    private cards: Map<String, Card>;
    private readonly cardsTemplates: Map<String, CardConfig>

    private cardClickedListener: PointerEventListener[] = [];

    private onSceneReadyListeners: any[] = []; // TODO: add type layer.

    constructor(config: any, key: string, cardsTemplates: any) {
        super({
            key: key,
            // active: false, // Scene starts inactive
            // visible: true   // Scene is initially visible
        });

        this.cardsTemplates = cardsTemplates;
        this.gos = [];
        this.cards = new Map<String, Card>();

        this.configBoard = config;
    }

    private width() {
        return this.configBoard.size.w;
    }

    private height() {
        return this.configBoard.size.h;
    }

    private cardWidth() {
        return this.configBoard.card.size.w;
    }

    private cardHeight() {
        return this.configBoard.card.size.h;
    }

    private hiddenCardTemplate() : CardConfig {
        return this.cardsTemplatesGet(this.configBoard.hiddenCardKey);
    }

    private cardsTemplatesGet(key: string): CardConfig {
        return this.cardsTemplates[key]!;
    }

    addCardClickedListener(listener: PointerEventListener) {
        this.cardClickedListener.push(listener);
    }

    preload() {
        this.configBoard.images.forEach((elem: [string, string]) => {
            this.load.image(elem[0], elem[1]);
        })

        // this.load.on("filecomplete", (key: string) => { console.log(`File loaded: ${key}`); });
    }

    create() {
        // this.createGo(new Position(256, 256), "archers.png");
        this.layCards();

        this.onSceneReady();
    }

    update() {}

    showCard(pos: Position, key: string) {
        const cardGoKey = `${pos.y},${pos.x}`

        const targetTemplate = this.cardsTemplatesGet(key);

        const targetCard = this.cards.get(cardGoKey)!;
        targetCard.setImage(targetTemplate.image);
    }

    private layCards() {
        for (let row = 0; row < this.height(); row++) {
            for (let col = 0; col < this.width(); col++) {
                const posY = row * this.cardWidth() + row * this.configBoard.card.betweenOffset.w + this.configBoard.card.borderOffset.w;
                const posX = col * this.cardHeight() + col * this.configBoard.card.betweenOffset.h + this.configBoard.card.borderOffset.h;

                const key = `${row},${col}`

                const boardPos = new Position(col, row);
                const windowPos = new Position(posY, posX);

                this.createCard(key, boardPos, windowPos, this.hiddenCardTemplate().image);
            }
        }
    }

    createCard(key: string, boardPos: Position, windowPos: Position, image: string): GameObject {
        let phaserGo = this.add.image(windowPos.x, windowPos.y, image)
            .setDisplaySize(this.cardWidth(), this.cardHeight()) // change absolute size
            //.setScale(2, 2) // changes scale
            .setOrigin(0, 0); // make the corner be the top-left instead of the center (0.5, 0.5)
        // this._scene.uiCam.ignore(objGo);

        const card = new Card(boardPos, windowPos, phaserGo);
        card.addLeftPointerUpListener(this.onCardLeftClicked.bind(this));
        this.cards.set(key, card);

        this.gos.push(card);
        return card;
    }

    private onCardLeftClicked(context: PointerEventContext) {
        this.cardClickedListener.forEach(listener => listener(context));
    }

    addOnSceneReadyListener(listener: any) {
        this.onSceneReadyListeners.push(listener);
    }

    onSceneReady() {
        console.log("Game Board is ready!");
        this.onSceneReadyListeners.forEach(listener => listener());
    }
}
import * as Phaser from "phaser";
import {Card} from "./card.js";
import {GameObject, PointerEventContext, PointerEventListener} from "./game-object.js";
import {CardConfig, CardProperties, GameBoardConfig, GameTextStyle} from "./game-config.js";
import {Position, Size} from "../../../shared/dist/princeps-shared.js"
import Text = Phaser.GameObjects.Text;
import {GameUi} from "./game-ui.js";
import Layer = Phaser.GameObjects.Layer;
import {ComponentsFactory} from "../components/components-factory.js";
import {SubmitEventListener} from "../components/text-input.js";

export class GameBoard extends Phaser.Scene {

    private gos: GameObject[];
    private cards: Map<String, Card>;

    private cardClickedListener: PointerEventListener[] = [];

    private textChatSubmitEventListener: SubmitEventListener[] = [];

    private onSceneReadyListeners: any[] = []; // TODO: add type layer.

    private readonly cardProperties: CardProperties;

    private _ui : GameUi | undefined;

    constructor(
        private configBoard: GameBoardConfig,
        private boardSize: number,
        private key: string,
        private cardsTemplates: Map<String, CardConfig>,
        private componentsFactory: ComponentsFactory
    ) {
        super({ key: key, active: false, visible: true });

        this.gos = [];
        this.cards = new Map<String, Card>();

        //@ts-ignore
        this.cardProperties = this.configBoard.cardsProperties[boardSize.toString()];
    }

    get ui(): GameUi {
        return this._ui!;
    }

    private width() {
        return this.cardProperties.dimension.w;
    }

    private height() {
        return this.cardProperties.dimension.h;
    }

    private size(): Size {
        return Size.of(this.width(), this.height());
    }

    private cardWidth() {
        return this.cardProperties.size.w;
    }

    private cardHeight() {
        return this.cardProperties.size.h;
    }

    private hiddenCardTemplate() : CardConfig {
        return this.cardsTemplatesGet(this.configBoard.hiddenCardKey);
    }

    private openCardTemplate() : CardConfig {
        return this.cardsTemplatesGet(this.configBoard.openCardKey);
    }

    private cardsTemplatesGet(key: string): CardConfig {
        // @ts-ignore
        return this.cardsTemplates[key]!;
    }

    addCardClickedListener(listener: PointerEventListener) {
        this.cardClickedListener.push(listener);
    }

    addTextChatSubmitListener(listener: SubmitEventListener) {
        this.textChatSubmitEventListener.push(listener);
    }

    private onTextChatSubmit(text: string) {
        this.textChatSubmitEventListener.forEach(listener => listener(text));
    }

    preload() {
        this.configBoard.images.forEach((elem: [string, string]) => {
            this.load.image(elem[0], elem[1]);
        })

        // this.load.on("filecomplete", (key: string) => { console.log(`File loaded: ${key}`); });
    }

    create() {
        this.layCards();

        this._ui = new GameUi(this, this.configBoard.ui, this.componentsFactory);
        this._ui.setup();

        this._ui.addTextChatSubmitListener(this.onTextChatSubmit.bind(this));

        this.onSceneReady();
    }

    update() {}

    showCard(pos: number, key: string) {
        const targetCard = this.getCardByIndexPos(pos);
        const targetTemplate = this.cardsTemplatesGet(key);

        targetCard.show(targetTemplate);
    }

    hideCard(pos: number) {
        const targetCard = this.getCardByIndexPos(pos);
        targetCard.hide(this.hiddenCardTemplate());
    }

    disableCard(pos: Position) {
        const targetCard = this.getCardByPos(pos);
        targetCard.disable();
    }

    hideAllCards(hideMatches: boolean = false) {
        this.cards.values().forEach(card => {
            if (!hideMatches && card.isMatch) {
                return;
            }
            card.hide(this.hiddenCardTemplate())
        })
    }

    private getCardByIndexPos(pos: number): Card {
        const y = Math.floor(pos / this.width());
        const x = pos - (y * this.width());

        return this.getCardByPos(Position.of(x, y));
    }

    private getCardByPos(pos: Position): Card {
        const cardGoKey = GameBoard.getCardKeyByPos(pos);
        return this.cards.get(cardGoKey)!;
    }

    private static getCardKey(x: number, y: number): string {
        return GameBoard.getCardKeyByPos(Position.of(y, x));
    }

    private static getCardKeyByPos(pos: Position): string {
        return `${pos.y},${pos.x}`;
    }

    private layCards() {
        for (let row = 0; row < this.height(); row++) {
            for (let col = 0; col < this.width(); col++) {
                const posY = row * this.cardHeight() + row * this.cardProperties.betweenOffset.h + this.cardProperties.borderOffset.h;
                const posX = col * this.cardWidth() + col * this.cardProperties.betweenOffset.w + this.cardProperties.borderOffset.w;

                const key = GameBoard.getCardKey(row, col);

                const boardPos = new Position(col, row);
                const windowPos = new Position(posX, posY);

                this.createCard(key, boardPos, windowPos, this.hiddenCardTemplate().image);
            }
        }
    }

    private createCard(key: string, boardPos: Position, windowPos: Position, image: string): GameObject {
        const backgroundCard = this.createBackgroundCard(windowPos);

        let phaserGo = this.add.image(windowPos.x, windowPos.y, image)
            .setDisplaySize(this.cardWidth(), this.cardHeight()) // change absolute size
            //.setScale(2, 2) // changes scale
            .setOrigin(0, 0); // make the corner be the top-left instead of the center (0.5, 0.5)
        // this._scene.uiCam.ignore(objGo);

        const label = this.createCardLabel(windowPos);
        const openDisplaySize = Size.of(this.cardWidth(), this.cardHeight());
        const card = new Card(boardPos, this.size(), label,false, backgroundCard, openDisplaySize, windowPos, phaserGo);
        card.addLeftPointerUpListener(this.onCardLeftClicked.bind(this));
        this.cards.set(key, card);

        this.gos.push(card);
        return card;
    }

    private createBackgroundCard(windowPos: Position) : GameObject {
        let phaserGo = this.add.image(windowPos.x, windowPos.y, this.openCardTemplate().image)
            .setDisplaySize(this.cardWidth(), this.cardHeight())
            .setOrigin(0, 0);

        const card = new GameObject(windowPos, false, phaserGo);
        card.setVisible(false);

        this.gos.push(card);
        return card;
    }

    private onCardLeftClicked(context: PointerEventContext) {
        this.cardClickedListener.forEach(listener => listener(context));
    }

    private createCardLabel(windowPos: Position) : Text {
        const label = this.addText(
            windowPos.x + this.cardProperties.labelText.offset.x,
            windowPos.y + this.cardProperties.labelText.offset.y,
            this.cardProperties.labelText.text,
            this.cardProperties.labelText.style
        );
        label.setOrigin(0.5, 0.5); // allows to center align correctly.
        label.setVisible(false);
        return label;
    }

    addOnSceneReadyListener(listener: any) {
        this.onSceneReadyListeners.push(listener);
    }

    onSceneReady() {
        console.log("Game Board is ready!");
        this.onSceneReadyListeners.forEach(listener => listener());
    }

    //
    // UI relay methods bellow: TODO: remove relay methods and use it directly
    //

    newLayer() : Layer {
        return this.add.layer();
    }

    addText(x : number, y : number, text: string, style: GameTextStyle) : Text {
        return this.add.text(x, y, text, style);
    }
}
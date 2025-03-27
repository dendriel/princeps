import * as Phaser from "phaser";
import {Card} from "./game/card.js";
import {Position} from "./position.js";
import {GameObject} from "./game-object.js";


export class GameBoard extends Phaser.Scene {

    private config: any;

    private gos: GameObject[];
    private cards: Map<String, GameObject>;

    constructor(config: any, key: string) {
        super({
            key: key,
            // active: false, // Scene starts inactive
            // visible: true   // Scene is initially visible
        });

        this.gos = [];
        this.cards = new Map<String, GameObject>();

        this.config = config;
    }

    private width() {
        return this.config.size.w;
    }

    private height() {
        return this.config.size.h;
    }

    private cardWidth() {
        return this.config.card.size.w;
    }

    private cardHeight() {
        return this.config.card.size.h;
    }

    preload() {
        this.config.images.forEach((elem: [string, string]) => {
            this.load.image(elem[0], elem[1]);
        })

        // this.load.on("filecomplete", (key: string) => { console.log(`File loaded: ${key}`); });
    }

    create() {
        // this.createGo(new Position(256, 256), "archers.png");
        this.layCards();
    }

    private layCards() {
        for (let row = 0; row < this.height(); row++) {
            for (let col = 0; col < this.width(); col++) {
                const posY = row * this.cardWidth() + row * this.config.card.betweenOffset.w + this.config.card.borderOffset.w;
                const posX = col * this.cardHeight() + col * this.config.card.betweenOffset.h + this.config.card.borderOffset.h;

                const key = `${row},${col}`
                this.createCard(key, new Position(posY, posX), "card-back.png");
            }
        }
    }

    createCard(key: string, pos: Position, image: string): GameObject {
        let phaserGo = this.add.image(pos.x, pos.y, image)
            .setDisplaySize(this.cardWidth(), this.cardHeight()) // change absolute size
            //.setScale(2, 2) // changes scale
            .setOrigin(0, 0); // make the corner be the top-left instead of the center (0.5, 0.5)
        // this._scene.uiCam.ignore(objGo);

        const card = new Card(-1, pos, phaserGo);
        this.cards.set(key, card);

        this.gos.push(card);
        return card;
    }

    update() {

    }
}
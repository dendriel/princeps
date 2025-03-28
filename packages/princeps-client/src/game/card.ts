import {GameObject} from "../game-object.js";
import {Position} from "../position.js";


export class Card extends GameObject {
    constructor(private _boardPos: Position, pos: Position, phaserGo: Phaser.GameObjects.Image) {
        super(pos, phaserGo);
    }

    get boardPos(): Position {
        return this._boardPos;
    }

    setImage(value: string) {
        this.phaserGo.setTexture(value);
    }
}
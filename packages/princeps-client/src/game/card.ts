import {GameObject} from "../game-object.js";
import {Position} from "../position.js";


export class Card extends GameObject {
    constructor(private value: number, pos: Position, phaserGo: Phaser.GameObjects.Image) {
        super(pos, phaserGo);
    }
}
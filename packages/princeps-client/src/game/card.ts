import {GameObject} from "../game-object.js";
import {Position} from "../position.js";
import SpriteWithStaticBody = Phaser.Types.Physics.Arcade.SpriteWithStaticBody;


export class Card extends GameObject {
    constructor(private value: number, pos: Position, phaserGo: Phaser.GameObjects.Image) {
        super(pos, phaserGo);
    }
}
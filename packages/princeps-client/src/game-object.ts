import {Position} from "./position.js";


export class GameObject {

    constructor(private pos: Position, private phaserGo: Phaser.GameObjects.Image) {
    }
}
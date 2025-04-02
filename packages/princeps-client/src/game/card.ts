import {GameObject} from "./game-object.js";
import {Position} from "./position.js";
import {CardConfig} from "./game-config.js";


export class Card extends GameObject {

    private _isMatch: boolean;

    constructor(
        private _boardPos: Position,
        private _isVisible: boolean,
        private backgroundGo: GameObject,
        pos: Position,
        phaserGo: Phaser.GameObjects.Image
    ) {
        super(pos, true, phaserGo);

        this._isMatch = false
    }

    get isVisible(): boolean {
        return this._isVisible;
    }

    get boardPos(): Position {
        return this._boardPos;
    }

    get isMatch(): boolean {
        return this._isMatch;
    }

    set isMatch(value: boolean) {
        this._isMatch = value;
    }

    show(cardConfig: CardConfig) {
        this.backgroundGo.setVisible(true);
        this.phaserGo.setTexture(cardConfig.image);
        this._isVisible = true;
    }

    hide(cardConfig: CardConfig) {
        this.backgroundGo.setVisible(false);
        this.phaserGo.setTexture(cardConfig.image);
        this._isVisible = false;
    }
}
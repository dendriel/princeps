import {GameObject} from "./game-object.js";
import {Position, Size} from "../../../shared/dist/princeps-shared.js"
import {CardConfig} from "./game-config.js";
import Text = Phaser.GameObjects.Text;


export class Card extends GameObject {

    private _isMatch: boolean;

    constructor(
        private _boardPos: Position,
        private boardSize: Size,
        private label: Text,
        private _isVisible: boolean,
        private backgroundGo: GameObject,
        private displaySize: Size,
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

    get boardIndex(): number {
        return (this._boardPos.y * this.boardSize.w) + this._boardPos.x;
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
        this.phaserGo.setDisplaySize(this.displaySize.w, this.displaySize.w);
        this._isVisible = true;

        this.label.setText(cardConfig.name);
        this.label.setVisible(true);
    }

    hide(cardConfig: CardConfig) {
        this.backgroundGo.setVisible(false);
        this.phaserGo.setTexture(cardConfig.image);
        this.phaserGo.setDisplaySize(this.displaySize.w, this.displaySize.h);
        this._isVisible = false;
        this.label.setVisible(false);
    }
}
import {Position} from "./position.js";

export type PointerEventContext = {
    target: GameObject
}

export interface PointerEventListener {
    (context: PointerEventContext): void
}

export class GameObject {
    leftPointerDownListeners: PointerEventListener[] = [];
    leftPointerUpListeners: PointerEventListener[] = [];

    constructor(private pos: Position, protected phaserGo: Phaser.GameObjects.Image) {
        this.wrapUp();
    }

    addLeftPointerDownListener(listener: PointerEventListener) {
        this.leftPointerDownListeners.push(listener);
    }

    addLeftPointerUpListener(listener: PointerEventListener) {
        this.leftPointerUpListeners.push(listener);
    }

    wrapUp() {
        if (this.phaserGo === undefined) {
            return;
        }

        this.phaserGo.setInteractive();
        // this.phaserGo.on("pointerover", () => {
        //     this._pointerOverListeners.forEach(listener => listener(this));
        // });

        this.phaserGo.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                // this._rightPointerDownListeners.forEach(listener => listener(this));
                return;
            }
            else {
                // this.leftPointerPosition = {x: pointer.camera.scrollX, y: pointer.camera.scrollY};
                this.leftPointerDownListeners.forEach(listener => listener({ target: this }));
            }
        });

        this.phaserGo.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonReleased()) {
                // this._rightPointerUpListeners.forEach(listener => listener(this));
                return;
            }
            else {
                // let isDrag = true;
                // if (this.leftPointerPosition) {
                //     isDrag = CalcUtils.isDrag(this.leftPointerPosition.x, this.leftPointerPosition.y, pointer.camera.scrollX, pointer.camera.scrollY, GameObject.minDragDistance);
                // }
                this.leftPointerUpListeners.forEach(listener => listener({ target: this }));
            }
        });
    }
}
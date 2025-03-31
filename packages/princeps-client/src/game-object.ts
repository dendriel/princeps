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

    constructor(private pos: Position, private interactive: boolean, protected phaserGo: Phaser.GameObjects.Image) {
        this.wrapUp();
    }

    setVisible(isVisible: boolean) {
        this.phaserGo.setVisible(isVisible);
    }

    setInteractive(isInteractive: boolean) {
        if (isInteractive) {
            this.enable();
        }
        else {
            this.disable();
        }
    }

    disable() {
        this.phaserGo.disableInteractive();
    }

    enable() {
        this.phaserGo.setInteractive();
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

        if (!this.interactive) {
            this.phaserGo.disableInteractive();
            return;
        }

        this.phaserGo.setInteractive();

        this.phaserGo.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                return;
            }
            else if (pointer.leftButtonDown()) {
                this.leftPointerDownListeners.forEach(listener => listener({ target: this }));
            }
        });

        this.phaserGo.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonReleased()) {
                return;
            }
            else if (pointer.leftButtonReleased()) {
                this.leftPointerUpListeners.forEach(listener => listener({ target: this }));
            }
        });
    }
}
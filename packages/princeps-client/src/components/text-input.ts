import {PositionGetter} from "./components-factory.js";
import {TextInputConfig} from "../game/game-config.js";
import {ResizableComponent} from "./resizable-component.js";
import {Size} from "../../../shared/dist/princeps-shared.js";


export interface SubmitEventListener {
    (text: string): void;
}

/**
 * TextInput allows using input fields alongside phaser.
 *
 * The component automatically repositions itself accordingly with the phaser canvas.
 * The component is resizable and can be used in a resizable game-board.
 */
export class TextInput implements ResizableComponent {

    private _input: HTMLInputElement | undefined;

    private submitListeners: SubmitEventListener[] = [];

    private sizeRatio: Size = Size.of(1, 1);

    private readonly fontSize: number;

    constructor(private config: TextInputConfig, private inputId: string, private canvasPositionGetter: PositionGetter) {

        this.fontSize = +this.config.textStyle.font.substring(0, 2);

        this.setup();
    }

    private setup() {
        const inputElem = document.getElementById(this.inputId) as HTMLInputElement;
        if (!inputElem) {
            console.log(`${this.inputId} is not available in the current page.`);
            return;
        }

        this._input = inputElem;
        this._input.style.position = "absolute";
        this._input.style.width = this.config.size.w + "px"
        this._input.style.height = this.config.size.h + "px";
        this._input.style.background = this.config.bg.fill;
        this._input.style.border = "none";
        this._input.maxLength = this.config.maxLength;
        // Font
        this._input.style.font = this.config.textStyle.font;
        this._input.style.color = this.config.textStyle.fill;

        this._input.disabled = false;

        this._input.addEventListener("keydown", this.keyPressed.bind(this));

        window.addEventListener('resize', this.updatePositionTimer.bind(this));
        window.addEventListener('fullscreenchange', this.updatePositionTimer.bind(this));
        // window.addEventListener('scroll', this.updatePositionTimer.bind(this));
        this.updatePosition();
    }

    public addSubmitListener(listener: SubmitEventListener) {
        this.submitListeners.push(listener);
    }

    public removeSubmitListener(listener: SubmitEventListener) {
        this.submitListeners = this.submitListeners.filter(l => l !== listener);
    }

    private updatePositionTimer() {
        setTimeout(this.updatePosition.bind(this), 100);
    }

    private updatePosition() {
        const canvasOffset = this.canvasPositionGetter();

        // Original formula (without a resizable game board)
        // const x = canvasOffset[0] + window.scrollX + this.config.offset.x;
        // const y = canvasOffset[1] + window.scrollY + this.config.offset.y;

        // For compensating the canvas size ratio.
        const extraCanvasOffsetW = canvasOffset[0] * (1 - this.sizeRatio.w);
        const extraCanvasOffsetH = canvasOffset[1] * (1 - this.sizeRatio.h);

        const x = (canvasOffset[0] + window.scrollX + this.config.offset.x) * this.sizeRatio.w + extraCanvasOffsetW;
        const y = (canvasOffset[1] + window.scrollY + this.config.offset.y) * this.sizeRatio.h + extraCanvasOffsetH;

        this._input!.style.left = x + "px";
        this._input!.style.top = y + "px";
    }

    private keyPressed(event: KeyboardEvent) {
        if (event.key !== "Enter") {
            return;
        }

        console.log("Enter key pressed:", this._input!.value);
        this.submitListeners.forEach(l => l(this._input!.value));
        this.clear();
    }

    private get input() {
        return this._input!;
    }

    public clear() {
        this.setText("");
    }

    public setText(text: string) {
        this.input.value = text;
    }

    onResize(baseSize: Size, displaySize: Size, ratio: Size): void {
        console.log(`Resizing text input: ${this.inputId} to ratio: ${ratio.w}, ${ratio.h}`);

        this.input.style.width = (this.config.size.w * ratio.w) + "px"
        this.input.style.height = (this.config.size.h * ratio.h) + "px";

        this.input.style.fontSize = (this.fontSize * ratio.h) + "px";

        this.sizeRatio = ratio;

        this.updatePosition();
    }
}
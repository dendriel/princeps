import {PositionGetter} from "./components-factory.js";
import {TextInputConfig} from "../game/game-config.js";


export interface SubmitEventListener {
    (text: string): void;
}

export class TextInput {

    private _input: HTMLInputElement | undefined;

    private submitListeners: SubmitEventListener[] = [];

    constructor(private config: TextInputConfig, private inputId: string, private canvasPositionGetter: PositionGetter) {
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
        const x = canvasOffset[0] + window.scrollX + this.config.offset.x;
        const y = canvasOffset[1] + window.scrollY + this.config.offset.y;
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
}
import {ChatManagerConfig} from "../game/game-config.js";
import * as Phaser from "phaser";
import {SubmitEventListener, TextInput} from "./text-input.js";
import {ComponentsFactory} from "./components-factory.js";

export interface PointerEventListener {
    (): void;
}

export class ChatManager {
    _text: Phaser.GameObjects.Text | undefined;

    _textInput: TextInput | undefined;

    pointerOverListeners : PointerEventListener[];
    pointerOutListeners : PointerEventListener[];

    content: string[];

    constructor(private config: ChatManagerConfig, private componentsFactory: ComponentsFactory) {
        this.content = [];

        this.pointerOverListeners = [];
        this.pointerOutListeners = [];
    }

    private get scrollFactor() {
        return this.config.scrollFactor;
    }

    private get text(): Phaser.GameObjects.Text {
        return this._text!;
    }

    appendText(text: string) {
        let newLines = this.getLinesFromText(text)
        this.content = this.content.concat(newLines);
        this.text.setText(this.content);
        this.text.y = this.config.startingScroll;
    }

    private getLinesFromText(text: string): string[] {
        // TODO: also break line when over max size
        return text.split('\n')
    }

    private getLinesFromTextByMaxChars(text: string): string[] {
        if (text.length <= this.config.maxLineChars) {
            return [text]
        }

        let lines = []
        let start = 0
        let end = this.config.maxLineChars;
        do {
            let curr = text.slice(start, end);
            lines.push(curr);

            start = end
            end = start + Math.min(text.length - start, this.config.maxLineChars)
        } while (start < text.length);

        return lines;
    }

    private get scrollMax() {
        let hiddenLines = Math.max(0, this.totalLines - this.maxLines);
        let hiddenLinesOffset = (hiddenLines * this.scrollFactor);
        return this.config.startingScroll + hiddenLinesOffset
    }

    private get scrollMin() {
        return this.config.startingScroll //- this.scrollFactor
    }

    private get totalLines() {
        return this.content.length;
    }

    private get maxLines() {
        return (this.config.textArea.size.h / this.scrollFactor) // 1;
    }

    setup(scene: Phaser.Scene) {
        const mainCam = scene.cameras.main;
        const textArea = this.config.textArea;

        let graphics = scene.add.graphics({x:0, y:0});
        const fillHex = parseInt(textArea.bg.fill.substring(1), 16);
        graphics.fillStyle(fillHex, textArea.bg.alpha);
        graphics.fillRect(textArea.offset.x, textArea.offset.y, textArea.size.w, textArea.size.h);

        let mask = new Phaser.Display.Masks.GeometryMask(scene, graphics);

        this._text = scene.add.text(textArea.offset.x + textArea.textOffset.x, textArea.offset.y + textArea.textOffset.y, this.content, textArea.textStyle)
            .setOrigin(0, 1);

        // The mask limits the text visibile in the screen.
        this.text.setMask(mask);

        this.text.y = this.config.startingScroll;

        // The zone helps to detect events over the text-chat, as scrolling.
        let zone = scene.add.zone(textArea.offset.x, textArea.offset.y, textArea.size.w, textArea.size.h).setOrigin(0).setInteractive();
        // mainCam.ignore([this._text, graphics, zone]); /* TODO: had to remove mask from the list */
        zone.on("wheel",  this.scrollText.bind(this));// (pointer, gameObjects, deltaX, deltaY, deltaZ) => this.scrollText(pointer, gameObjects, deltaX));
        zone.on("pointerover", () => this.onPointerOver());
        zone.on("pointerout", () => this.onPointerOut());

        this._textInput = this.componentsFactory.createTextInput(this.config.textInput, "chatInput");
    }

    private scrollText(pointer: Phaser.Input.Pointer, gos: Phaser.GameObjects.GameObject[], deltaX: number) {
        if (this.totalLines > this.maxLines) {
            this.text.y += (deltaX > 0) ? -this.scrollFactor : this.scrollFactor;
            this.text.y = Phaser.Math.Clamp(this.text.y, this.scrollMin, this.scrollMax);
            console.log("scroll")
        }
    }

    addPointerOverListener(listener: PointerEventListener) {
        this.pointerOverListeners.push(listener);
    }

    private onPointerOver() {
        this.pointerOverListeners.forEach(listener => listener());
    }

    addPointerOutListener(listener: PointerEventListener) {
        this.pointerOutListeners.push(listener);
    }

    private onPointerOut() {
        this.pointerOutListeners.forEach(listener => listener());
    }

    public addSubmitListener(listener: SubmitEventListener) {
        this._textInput?.addSubmitListener(listener);
    }

    public removeSubmitListener(listener: SubmitEventListener) {
        this._textInput?.removeSubmitListener(listener);
    }
}

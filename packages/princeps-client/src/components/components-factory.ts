import {TextInput} from "./text-input.js";
import {ChatManager} from "./chat-manager.js";
import {ChatManagerConfig, TextInputConfig} from "../game/game-config.js";
import {Size} from "../../../shared/dist/princeps-shared.js";
import {ResizableComponent} from "./resizable-component.js";

/**
 * Provides the width and weight of an object.
 */
export interface PositionGetter {
    (): [number, number, number, number];
}

export class ComponentsFactory {

    private readonly resizableComponents: ResizableComponent[] = [];

    constructor(private canvasPositionGetter: PositionGetter) {
    }

    public onSceneResize(baseSize: Size, displaySize: Size, ratio: Size) {
        this.resizableComponents.forEach(comp => {
            comp.onResize(baseSize, displaySize, ratio);
        });
    }

    public createTextInput(config: TextInputConfig, inputId: string): TextInput {
        return this.storeResizable(new TextInput(config, inputId, this.canvasPositionGetter));
    }

    private storeResizable<T extends ResizableComponent>(comp: T): T {
        this.resizableComponents.push(comp);
        return comp;
    }

    public createChatManager(config: ChatManagerConfig): ChatManager {
        return new ChatManager(config, this);
    }
}
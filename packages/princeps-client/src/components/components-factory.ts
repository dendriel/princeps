import {TextInput} from "./text-input.js";
import {ChatManager} from "./chat-manager.js";
import {ChatManagerConfig, TextInputConfig} from "../game/game-config.js";

/**
 * Provides the width and weight of an object.
 */
export interface PositionGetter {
    (): [number, number];
}

export class ComponentsFactory {
    constructor(private canvasPositionGetter: PositionGetter) {
    }

    public createTextInput(config: TextInputConfig, inputId: string): TextInput {
        return new TextInput(config, inputId, this.canvasPositionGetter);
    }

    public createChatManager(config: ChatManagerConfig): ChatManager {
        return new ChatManager(config, this);
    }
}
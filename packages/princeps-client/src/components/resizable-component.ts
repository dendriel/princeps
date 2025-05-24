import {Size} from "../../../shared/dist/princeps-shared.js";

export interface ResizableComponent {
    /**
     * Called when the component is resized.
     * @param baseSize The base size of the component.
     * @param displaySize The display size of the component.
     * @param ratio The ratio of the component.
     */
    onResize(baseSize: Size, displaySize: Size, ratio: Size): void;
}
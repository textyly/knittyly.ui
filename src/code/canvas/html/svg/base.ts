import { Canvas } from "../../base.js";
import { Size } from "../../types.js";

export abstract class SvgCanvasBase extends Canvas {
    protected svgCanvas: HTMLElement;

    constructor(svgCanvas: HTMLElement) {
        super();

        this.svgCanvas = svgCanvas;
    }

    protected override initializeCore(): void {
        const sizeChangedUn = super.onSizeChange(this.handleSizeChange.bind(this));
        super.registerUn(sizeChangedUn);
    }

    protected override disposeCore(): void {
        // do nothing
    }

    private handleSizeChange(size: Size): void {
        this.svgCanvas.setAttribute("width", size.width.toString());
        this.svgCanvas.setAttribute("height", size.height.toString());
    }
}
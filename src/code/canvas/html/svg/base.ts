import { Canvas } from "../../base.js";

export abstract class SvgCanvasBase extends Canvas {
    protected svgCanvas: HTMLElement;

    constructor(svgCanvas: HTMLElement) {
        super();

        this.svgCanvas = svgCanvas;
    }

    protected override initializeCore(): void {
        // do nothing
    }

    protected override sizeChangeCore(): void {
        const size = super.size;
        const width = size.width.toString();
        const height = size.height.toString();

        this.svgCanvas.setAttribute("width", width);
        this.svgCanvas.setAttribute("height", height);
    }

    protected override disposeCore(): void {
        // do nothing
    }
}
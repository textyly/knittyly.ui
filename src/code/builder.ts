import { UserInputCanvasThrottler } from "./canvas/headless/throttler.js";
import { UserInputCanvasCapturer } from "./canvas/headless/ui.js";
import { IHeadlessCanvas } from "./canvas/headless/types.js";
import { VirtualCanvas } from "./canvas/virtual/virtual.js";
import { GridCanvas } from "./canvas/visible/grid.js";
import { UnknownCanvas } from "./canvas/visible/unknown.js";
import { IVirtualCanvas } from "./canvas/virtual/types.js";

export class CanvasBuilder {
    public build(): IVirtualCanvas {
        const userInputSvgCanvas = this.createUserInputSvgCanvas();
        const userInputCanvasCapturer = this.createUserInputCanvasCapturer(userInputSvgCanvas);
        const headlessCanvas = this.createUserInputCanvasThrottler(userInputCanvasCapturer);
        const virtualCanvas = this.createVirtualCanvas(headlessCanvas);
        const gridCanvas = this.createGridCanvas(virtualCanvas);
        const unknownCanvas = this.createUnknownCanvas(virtualCanvas);
        return virtualCanvas
    }

    // this svg canvas will be used only for user input activity, such as mouse event handling
    private createUserInputSvgCanvas(): HTMLElement {
        const canvas = document.getElementById("plot") as HTMLElement;
        canvas.setAttribute("width", window.innerWidth.toString());
        canvas.setAttribute("height", window.innerHeight.toString());
        return canvas;
    }

    private createUserInputCanvasCapturer(userInputSvgCanvas: HTMLElement): IHeadlessCanvas {
        const canvas = new UserInputCanvasCapturer(userInputSvgCanvas);
        canvas.initialize();
        return canvas;
    }

    private createUserInputCanvasThrottler(userInputCanvasCapturer: IHeadlessCanvas): IHeadlessCanvas {
        const headlessCanvas = new UserInputCanvasThrottler(userInputCanvasCapturer);
        headlessCanvas.initialize();
        return headlessCanvas;
    }

    private createVirtualCanvas(userInputCanvasThrottler: IHeadlessCanvas): IVirtualCanvas {
        const virtualCanvas = new VirtualCanvas(userInputCanvasThrottler);
        virtualCanvas.initialize();
        return virtualCanvas;
    }

    private createGridCanvas(virtualCanvas: IVirtualCanvas): GridCanvas {
        const rasterCanvas = document.getElementById("canvas") as HTMLCanvasElement;
        rasterCanvas.width = window.innerWidth;
        rasterCanvas.height = window.innerHeight;

        const gridCanvas = new GridCanvas(rasterCanvas, virtualCanvas);
        return gridCanvas;
    }

    private createUnknownCanvas(virtualCanvas: IVirtualCanvas): UnknownCanvas {
        const svgCanvas = document.getElementById("svg") as HTMLElement;
        svgCanvas?.setAttribute("width", window.innerWidth.toString());
        svgCanvas?.setAttribute("height", window.innerHeight.toString());

        const unknownCanvas = new UnknownCanvas(svgCanvas, virtualCanvas);
        return unknownCanvas;
    }
}
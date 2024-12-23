import { UserInputThrottler } from "./canvas/transparent/throttler.js";
import { UserInputCanvas } from "./canvas/transparent/userInput.js";
import { ITransparentCanvas } from "./canvas/transparent/types.js";
import { VirtualDrawing } from "./canvas/virtual/drawing.js";
import { DotCanvas } from "./canvas/visible/dot.js";
import { CueCanvas } from "./canvas/visible/cue.js";
import { IVirtualCanvas } from "./canvas/virtual/types.js";
import { RasterCanvas } from "./canvas/html/raster.js";
import { SvgCanvas } from "./canvas/html/svg.js";

export class CanvasBuilder {
    public build(): IVirtualCanvas {
        const userInputCanvasCapturer = this.buildUserInputCanvasCapturer();
        const userInputCanvasThrottler = this.buildUserInputCanvasThrottler(userInputCanvasCapturer);
        const virtualCanvas = this.buildVirtualCanvas(userInputCanvasThrottler);

        this.buildDotCanvas(virtualCanvas);
        this.buildUnknownCanvas(virtualCanvas);

        return virtualCanvas;
    }

    private buildUserInputCanvasCapturer(): ITransparentCanvas {
        const userInputSvgCanvas = document.getElementById("plot") as HTMLElement;
        userInputSvgCanvas.setAttribute("width", window.innerWidth.toString());
        userInputSvgCanvas.setAttribute("height", window.innerHeight.toString());

        const canvas = new UserInputCanvas(userInputSvgCanvas);
        canvas.initialize();
        return canvas;
    }

    private buildUserInputCanvasThrottler(userInputCanvasCapturer: ITransparentCanvas): ITransparentCanvas {
        const headlessCanvas = new UserInputThrottler(userInputCanvasCapturer);
        headlessCanvas.initialize();
        return headlessCanvas;
    }

    private buildVirtualCanvas(userInputCanvasThrottler: ITransparentCanvas): IVirtualCanvas {
        const virtualCanvas = new VirtualDrawing(userInputCanvasThrottler);
        virtualCanvas.initialize();
        return virtualCanvas;
    }

    private buildDotCanvas(virtualCanvas: IVirtualCanvas): void {
        const htmlCanvas = document.getElementById("canvas") as HTMLCanvasElement;
        htmlCanvas.width = window.innerWidth;
        htmlCanvas.height = window.innerHeight;

        const wrapper = new RasterCanvas(htmlCanvas);
        const gridCanvas = new DotCanvas(wrapper, virtualCanvas);
        gridCanvas.initialize();
    }

    private buildUnknownCanvas(virtualCanvas: IVirtualCanvas): void {
        const svgCanvas = document.getElementById("svg") as HTMLElement;
        svgCanvas.setAttribute("width", window.innerWidth.toString());
        svgCanvas.setAttribute("height", window.innerHeight.toString());

        const wrapper = new SvgCanvas(svgCanvas);
        const cueCanvas = new CueCanvas(wrapper, virtualCanvas);
        cueCanvas.initialize();
    }
}
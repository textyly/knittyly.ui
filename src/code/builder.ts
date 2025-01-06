import { UserInputThrottler } from "./canvas/transparent/throttler.js";
import { UserInputCanvas } from "./canvas/transparent/userInput.js";
import { ITransparentCanvas } from "./canvas/transparent/types.js";
import { VirtualDrawing } from "./canvas/virtual/drawing.js";
import { CueCanvas } from "./canvas/visible/cue/base.js";
import { IVirtualCanvas } from "./canvas/virtual/types.js";
import { RasterCanvas } from "./canvas/html/raster/raster.js";
import { SvgCanvas } from "./canvas/html/svg/svg.js";
import { FrontDotCanvas } from "./canvas/visible/dot/front.js";
import { TransparentSvgCanvas } from "./canvas/html/svg/transparent.js";

export class CanvasBuilder {
    public build(): IVirtualCanvas {
        const userInputCanvasCapturer = this.buildUserInputCanvas();
        const userInputCanvasThrottler = this.buildUserInputCanvasThrottler(userInputCanvasCapturer);
        const virtualCanvas = this.buildVirtualCanvas(userInputCanvasThrottler);

        this.buildDotCanvas(virtualCanvas);
        this.buildUnknownCanvas(virtualCanvas);

        return virtualCanvas;
    }

    private buildUserInputCanvas(): ITransparentCanvas {
        const svgCanvas = document.getElementById("plot") as HTMLElement;
        const wrapper = new TransparentSvgCanvas(svgCanvas);
        wrapper.initialize();

        const canvas = new UserInputCanvas(wrapper);
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
        const wrapper = new RasterCanvas(htmlCanvas);
        wrapper.initialize();

        const gridCanvas = new FrontDotCanvas(wrapper, virtualCanvas);
        gridCanvas.initialize();
    }

    private buildUnknownCanvas(virtualCanvas: IVirtualCanvas): void {
        const svgCanvas = document.getElementById("svg") as HTMLElement;
        const wrapper = new SvgCanvas(svgCanvas);
        wrapper.initialize();

        const cueCanvas = new CueCanvas(wrapper, virtualCanvas);
        cueCanvas.initialize();
    }
}
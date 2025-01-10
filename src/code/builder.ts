import { InputCanvasThrottler } from "./canvas/input/throttler.js";
import { InputCanvas } from "./canvas/input/input.js";
import { IInputCanvas } from "./canvas/input/types.js";
import { VirtualCanvas } from "./canvas/virtual/virtual.js";
import { DynamicCanvas } from "./canvas/drawing/dynamic/dynamic.js";
import { IVirtualCanvas } from "./canvas/virtual/types.js";
import { TransparentCanvas } from "./canvas/input/transparent.js";
import { RasterCanvas } from "./canvas/drawing/raster/raster.js";
import { FrontStaticCanvas } from "./canvas/drawing/static/front.js";
import { SvgCanvas } from "./canvas/drawing/svg/svg.js";

export class CanvasBuilder {
    public build(): IVirtualCanvas {
        const userInputCanvas = this.buildUserInputCanvas();
        const userInputCanvasThrottler = this.buildUserInputCanvasThrottler(userInputCanvas);
        const virtualCanvas = this.buildVirtualCanvas(userInputCanvasThrottler);

        this.buildDotCanvas(virtualCanvas);
        this.buildUnknownCanvas(virtualCanvas);

        return virtualCanvas;
    }

    private buildUserInputCanvas(): IInputCanvas {
        const svgCanvas = document.getElementById("plot") as HTMLElement;
        const wrapper = new TransparentCanvas(svgCanvas);
        wrapper.initialize();

        const canvas = new InputCanvas(wrapper);
        canvas.initialize();

        return canvas;
    }

    private buildUserInputCanvasThrottler(userInputCanvasCapturer: IInputCanvas): IInputCanvas {
        const headlessCanvas = new InputCanvasThrottler(userInputCanvasCapturer);
        headlessCanvas.initialize();
        return headlessCanvas;
    }

    private buildVirtualCanvas(userInputCanvasThrottler: IInputCanvas): IVirtualCanvas {
        const dotsConfig = { x: 30, y: 20, radius: { value: 2, step: 0.2 }, spacing: { value: 20, step: 2 } };
        const virtualCanvas = new VirtualCanvas(dotsConfig, userInputCanvasThrottler);
        virtualCanvas.initialize();
        return virtualCanvas;
    }

    private buildDotCanvas(virtualCanvas: IVirtualCanvas): void {
        const htmlCanvas = document.getElementById("canvas") as HTMLCanvasElement;
        const wrapper = new RasterCanvas(htmlCanvas);
        wrapper.initialize();

        const gridCanvas = new FrontStaticCanvas(wrapper, virtualCanvas);
        gridCanvas.initialize();
    }

    private buildUnknownCanvas(virtualCanvas: IVirtualCanvas): void {
        const svgCanvas = document.getElementById("svg") as HTMLElement;
        const wrapper = new SvgCanvas(svgCanvas);
        wrapper.initialize();

        const cueCanvas = new DynamicCanvas(wrapper, virtualCanvas);
        cueCanvas.initialize();
    }
}
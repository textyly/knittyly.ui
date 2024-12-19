import { HeadlessCanvasThrottler } from "./canvas/headless/throttler.js";
import { UserInputCanvasCapturer } from "./canvas/headless/ui.js";
import { IHeadlessCanvas } from "./canvas/headless/types.js";
import { VirtualCanvas } from "./canvas/virtual/virtual.js";
import { GridCanvas } from "./canvas/visible/grid.js";
import { UnknownCanvas } from "./canvas/visible/unknown.js";

export class AppBuilder {
    private rasterCanvas!: HTMLCanvasElement;
    private svgCanvas!: HTMLElement;
    private headlessCanvas!: IHeadlessCanvas;
    private virtualCanvas!: VirtualCanvas;
    private gridCanvas!: GridCanvas;
    private unknownCanvas!: UnknownCanvas;

    public build(): void {
        const svgPlot = document.getElementById("plot") as HTMLElement;
        svgPlot?.setAttribute("width", window.innerWidth.toString());
        svgPlot?.setAttribute("height", window.innerHeight.toString());

        this.headlessCanvas = new UserInputCanvasCapturer(svgPlot);
        this.headlessCanvas.initialize();

        this.headlessCanvas = new HeadlessCanvasThrottler(this.headlessCanvas);
        this.headlessCanvas.initialize();

        this.virtualCanvas = new VirtualCanvas(this.headlessCanvas);
        this.virtualCanvas.initialize();

        this.rasterCanvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.rasterCanvas.width = window.innerWidth;
        this.rasterCanvas.height = window.innerHeight;
        this.gridCanvas = new GridCanvas(this.rasterCanvas, this.virtualCanvas);

        this.svgCanvas = document.getElementById("svg") as HTMLElement;
        this.svgCanvas?.setAttribute("width", window.innerWidth.toString());
        this.svgCanvas?.setAttribute("height", window.innerHeight.toString());
        this.unknownCanvas = new UnknownCanvas(this.svgCanvas, this.virtualCanvas);

        this.virtualCanvas.draw();
    }
}
import { Canvas } from "../../base.js";
import { RasterCanvas } from "../../html/raster.js";
import { DrawGridEvent, DrawLineEvent, IVirtualCanvas, Line } from "../../virtual/types.js";

export abstract class DotCanvas extends Canvas {
    protected readonly rasterCanvas: RasterCanvas;
    protected readonly virtualCanvas: IVirtualCanvas;

    constructor(rasterCanvas: RasterCanvas, virtualCanvas: IVirtualCanvas) {
        super(virtualCanvas.size.width, virtualCanvas.size.height);

        this.rasterCanvas = rasterCanvas;
        this.virtualCanvas = virtualCanvas;
    }

    override initializeCore(): void {
        const drawGridUn = this.virtualCanvas.onDrawGrid(this.handleDrawGrid.bind(this));
        super.registerUn(drawGridUn);

        const drawLineUn = this.virtualCanvas.onDrawLine(this.handleDrawLine.bind(this));
        super.registerUn(drawLineUn);
    }

    override disposeCore(): void {
        // base class will unsubscribe handleDrawGrid and handleDrawLine
    }

    abstract drawLine(line: Line): void;

    private handleDrawGrid(event: DrawGridEvent): void {
        // this handler might be drawing intensive, which means it might impact the CPU usage and smooth visualization
        this.rasterCanvas.clear();

        const dots = event.dots;
        dots.forEach((dot) => this.rasterCanvas.drawDot(dot));

        const lines = event.lines;
        lines.forEach((line) => this.drawLine(line));
    }

    private handleDrawLine(event: DrawLineEvent): void {
        const line = event.line;
        this.drawLine(line);
    }
}
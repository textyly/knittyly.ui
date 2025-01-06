import { RasterCanvas } from "../../html/raster/raster.js";
import { CanvasSide, IVirtualCanvas, Line } from "../../virtual/types.js";
import { DotCanvas } from "./base.js";

export class BackDotCanvas extends DotCanvas {
    constructor(rasterCanvas: RasterCanvas, virtualCanvas: IVirtualCanvas) {
        super(rasterCanvas, virtualCanvas);
    }

    override drawLine(line: Line): void {
        if (line.side === CanvasSide.Front) {
            return; // ignore front lines
        }
        this.rasterCanvas.drawLine(line);
    }
}
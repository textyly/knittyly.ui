import { RasterCanvas } from "../../html/raster/raster.js";
import { CanvasSide, IVirtualCanvas, Line } from "../../virtual/types.js";
import { DotCanvas } from "./base.js";

export class FrontDotCanvas extends DotCanvas {
    constructor(rasterCanvas: RasterCanvas, virtualCanvas: IVirtualCanvas) {
        super(rasterCanvas, virtualCanvas);
    }

    override drawLine(line: Line): void {
        if (line.side === CanvasSide.Back) {
            return; // ignore back lines
        }
        this.rasterCanvas.drawLine(line);
    }
}
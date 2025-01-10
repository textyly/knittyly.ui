import { StaticCanvasBase } from "./base.js";
import { RasterCanvas } from "../raster/raster.js";
import { CanvasSide, IVirtualCanvas, Line } from "../../virtual/types.js";

export class FrontStaticCanvas extends StaticCanvasBase {
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
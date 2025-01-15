import { MouseLeftButtonDownEvent } from "./input/types.js";
import { VirtualCanvasBase } from "./virtual/base.js";
import { DotVirtualCanvas } from "./virtual/dot/virtual.js";
import { CanvasSide } from "./virtual/types.js";

export abstract class SideVirtualCanvas extends VirtualCanvasBase {
    protected dotVirtualCanvas: DotVirtualCanvas;
    protected side: CanvasSide;

    constructor(dotVirtualCanvas: DotVirtualCanvas) {
        super();
        this.dotVirtualCanvas = dotVirtualCanvas;
        this.side = CanvasSide.Front;
    }

    protected invokeMouseLeftButtonDown(event: MouseLeftButtonDownEvent): void {
        const clickedDot = this.dotVirtualCanvas.clickedDot;
        if (!clickedDot) {
            return;
        }
        const hoveredDot = this.dotVirtualCanvas.hoveredDot;
        if (hoveredDot) {
            this.side = this.side === CanvasSide.Front ? CanvasSide.Back : CanvasSide.Front;
        }
    }
}
import { Canvas } from "../../base.js";
import { SvgCanvas } from "../../html/svg/svg.js";
import { SvgDot, SvgLine } from "../../html/types.js";
import { Size } from "../../types.js";
import {
    Id,
    CanvasSide,
    HoverDotEvent,
    UnhoverDotEvent,
    DrawLinkEvent,
    IVirtualCanvas,
    RemoveLinkEvent
} from "../../virtual/types.js";

export class CueCanvas extends Canvas {
    protected readonly svgCanvas: SvgCanvas;
    protected readonly virtualCanvas: IVirtualCanvas;

    private readonly dots: Map<Id, SvgDot>;
    private readonly lines: Map<Id, SvgLine>;

    constructor(svgCanvas: SvgCanvas, virtualCanvas: IVirtualCanvas) {
        super();

        this.svgCanvas = svgCanvas;
        this.virtualCanvas = virtualCanvas;

        this.dots = new Map<Id, SvgDot>();
        this.lines = new Map<Id, SvgLine>();
    }

    override initializeCore(): void {
        const drawLinkUn = this.virtualCanvas.onDrawLink(this.handleDrawLink.bind(this));
        super.registerUn(drawLinkUn);

        const removeLinkUn = this.virtualCanvas.onRemoveLink(this.handleRemoveLink.bind(this));
        super.registerUn(removeLinkUn);

        const dotHoveredUn = this.virtualCanvas.onHoverDot(this.handleDotHovered.bind(this));
        super.registerUn(dotHoveredUn);

        const dotUnhoveredUn = this.virtualCanvas.onUnhoverDot(this.handleDotUnhovered.bind(this));
        super.registerUn(dotUnhoveredUn);

        const sizeChangedUn = this.virtualCanvas.onSizeChange(this.handleSizeChange.bind(this));
        super.registerUn(sizeChangedUn);
    }

    override disposeCore(): void {
        this.dots.clear();
        this.lines.clear();

        // base class will unsubscribe handleDrawLink, handleRemoveLink, handleDotHovered and handleDotUnhovered
    }

    private handleDotHovered(event: HoverDotEvent): void {
        const dot = event.dot;
        const id = dot.id;

        const svgDot = this.svgCanvas.drawDot(dot);
        this.dots.set(id, svgDot);
    }

    private handleDotUnhovered(event: UnhoverDotEvent): void {
        const dotId = event.dot.id;
        if (this.dots.has(dotId)) {
            const dot = this.dots.get(dotId)!;
            this.svgCanvas.removeDot(dot)
            this.dots.delete(dotId);
        }
    }

    private handleDrawLink(event: DrawLinkEvent): void {
        const id = event.link.id;
        const from = event.link.from;
        const to = event.link.to;
        const side = event.link.side;

        const svgLine = side === CanvasSide.Front
            ? this.svgCanvas.drawLine(from, to)
            : this.svgCanvas.drawDashLine(from, to);

        this.lines.set(id, svgLine);
    }

    private handleRemoveLink(even: RemoveLinkEvent): void {
        const lineId = even.link.id.toString();
        if (this.lines.has(lineId)) {
            const line = this.lines.get(lineId)!;
            this.svgCanvas.removeLine(line);
            this.lines.delete(lineId);
        }
    }

    private handleSizeChange(size: Size): void {
        this.svgCanvas.size = size;
    }
}
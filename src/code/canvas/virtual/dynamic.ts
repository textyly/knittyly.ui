import { VirtualCanvasBase } from "./base.js";
import { StaticVirtualCanvas } from "./static.js";
import { CanvasSide, Line, Link } from "./types.js";
import { IdGenerator } from "../../utilities/generator.js";
import { MouseMoveEvent, MouseLeftButtonDownEvent } from "../input/types.js";

export class DynamicVirtualCanvas extends VirtualCanvasBase {
    // #region fields

    private dotVirtualCanvas: StaticVirtualCanvas;

    private link?: Link;
    private side: CanvasSide;

    private lines: Array<Line>;
    private idsLines: IdGenerator;

    // #endregion

    constructor(virtualDotCanvas: StaticVirtualCanvas) {
        super();

        this.dotVirtualCanvas = virtualDotCanvas;
        this.side = CanvasSide.Back;

        this.lines = [];
        this.idsLines = new IdGenerator();

    }
    // #region interface 

    public draw(): void {
        this.idsLines.reset();

        this.lines = this.createLines();

        this.lines.forEach((line) => {
            const lineEvent = { line };
            super.invokeDrawLine(lineEvent);
        });
    }

    public invokeZoomIn(): void {
        this.draw();

        if (this.link) {
            const position = this.link.to;
            this.invokeMouseMove({ position });
        }
    }

    public invokeZoomOut(): void {
        this.draw();

        if (this.link) {
            const position = this.link.to;
            this.invokeMouseMove({ position });
        }
    }

    public invokeMouseMove(event: MouseMoveEvent): void {
        const position = event.position;
        const clickedDot = this.dotVirtualCanvas.clickedDot;

        if (!clickedDot) {
            return;
        }

        if (this.link) {
            super.invokeRemoveLink({ link: this.link });
        }

        const id = this.idsLines.next();
        const from = clickedDot;
        const to = { id, x: position.x, y: position.y, radius: clickedDot.radius };
        const side = this.side;

        this.link = { id, from, to, side };
        super.invokeDrawLink({ link: this.link });
    }

    public invokeMouseLeftButtonDown(event: MouseLeftButtonDownEvent): void {
        const clickedDot = this.dotVirtualCanvas.clickedDot;

        if (!clickedDot) {
            // TODO: check this case when clicking on the same dot multiple times
            this.side = CanvasSide.Front;
            return;
        }

        const hoveredDot = this.dotVirtualCanvas.hoveredDot;
        if (hoveredDot) {
            const line = { from: clickedDot, to: hoveredDot, side: this.side };
            this.lines.push(line);

            super.invokeDrawLine({ line });

            this.side = this.side === CanvasSide.Front ? CanvasSide.Back : CanvasSide.Front;
        }
    }

    // #endregion

    // #region methods

    private createLines(): Array<Line> {
        const lines = new Array<Line>();

        this.lines.forEach((line) => {
            const from = this.dotVirtualCanvas.get(line.from.id)!; // TODO: what if undefined ???
            const to = this.dotVirtualCanvas.get(line.to.id)!; // TODO: what if undefined ???
            const l = { from, to, side: line.side };
            lines.push(l);
        });

        return lines;
    }

    // #endregion
}
import { ILineVirtualCanvas, Line } from "../types.js";
import { MouseLeftButtonDownEvent } from "../../input/types.js";
import { DotVirtualCanvas } from "../dot/virtual.js";
import { SideVirtualCanvas } from "../../side.js";

export class LineVirtualCanvas extends SideVirtualCanvas implements ILineVirtualCanvas {
    private lines: Array<Line>;

    constructor(dotVirtualCanvas: DotVirtualCanvas) {
        super(dotVirtualCanvas);
        this.lines = [];
    }

    public draw(): void {
        this.lines = this.createLines();

        this.lines.forEach((line) => {
            const lineEvent = { line };
            super.invokeDrawLine(lineEvent);
        });
    }

    public invokeZoomIn(): void {
        this.draw();
    }

    public invokeZoomOut(): void {
        this.draw();
    }

    public invokeMouseLeftButtonDown(event: MouseLeftButtonDownEvent): void {
        const clickedDot = this.dotVirtualCanvas.clickedDot;

        if (!clickedDot) {
            return;
        }

        const hoveredDot = this.dotVirtualCanvas.hoveredDot;
        if (hoveredDot) {
            const line = { from: clickedDot, to: hoveredDot, side: this.side };
            this.lines.push(line);

            super.invokeDrawLine({ line });
            super.invokeMouseLeftButtonDown(event);
        }
    }

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
}
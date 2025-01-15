import { CanvasSide, Id, ILineVirtualCanvas, Line } from "./types.js";
import { MouseLeftButtonDownEvent, Position } from "../input/types.js";
import { VirtualCanvasBase } from "./base.js";
import { DotVirtualCanvas } from "./dot.js";

export class LineVirtualCanvas extends VirtualCanvasBase implements ILineVirtualCanvas {
    private readonly dotVirtualCanvas: DotVirtualCanvas;

    private lines: Array<Line>;

    private clicked?: Id;
    private side: CanvasSide;

    constructor(dotVirtualCanvas: DotVirtualCanvas) {
        super();
        this.dotVirtualCanvas = dotVirtualCanvas;
        this.side = CanvasSide.Default;
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
        const position = event.position;
        this.handleDotClick(position);
    }

    private handleDotClick(position: Position): void {
        const clicked = this.dotVirtualCanvas.getDotByCoordinates(position.x, position.y);
        if (clicked) {
            if (!this.clicked) {
                this.side = CanvasSide.Front;
            } else {
                const previous = this.dotVirtualCanvas.getDotById(this.clicked!)!;
                const line: Line = { from: previous, to: clicked, side: this.side };
                this.handleDrawLine(line);
                this.side = this.side === CanvasSide.Front ? CanvasSide.Back : CanvasSide.Front;
            }
            this.clicked = clicked.id;
        }
    }

    private handleDrawLine(line: Line): void {
        this.lines.push(line);
        const drawLineEvent = { line };
        super.invokeDrawLine(drawLineEvent);
    }

    private createLines(): Array<Line> {
        const lines = new Array<Line>();

        this.lines.forEach((line) => {
            const from = this.dotVirtualCanvas.getDotById(line.from.id)!; // TODO: what if undefined ???
            const to = this.dotVirtualCanvas.getDotById(line.to.id)!; // TODO: what if undefined ???
            const l = { from, to, side: line.side };
            lines.push(l);
        });

        return lines;
    }
}
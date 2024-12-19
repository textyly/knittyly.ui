import {
    Dot,
    DrawGridEvent,
    DrawLineEvent,
    IVirtualCanvas,
    Line,
    MousePositionType
} from "../virtual/types.js";

export class GridCanvas {
    private context: CanvasRenderingContext2D;

    constructor(
        private htmlCanvas: HTMLCanvasElement,
        private virtualCanvas: IVirtualCanvas) {

        this.context = this.htmlCanvas.getContext("2d")!;

        // TODO: move out from here
        this.subscribe();
    }

    private subscribe(): void {
        this.virtualCanvas.onDrawGrid(this.handleDrawGrid.bind(this));
        this.virtualCanvas.onDrawLine(this.handleDrawLine.bind(this))
    }

    private unsubscribe(): void {

    }

    private handleDrawGrid(event: DrawGridEvent): void {
        this.draw(event.dots, event.lines);
    }

    private handleDrawLine(event: DrawLineEvent): void {
        this.drawLine(event.line);
    }

    private draw(dots: Array<Dot>, lines: Array<Line>): void {
        this.context.clearRect(0, 0, this.htmlCanvas.clientWidth, this.htmlCanvas.clientWidth);

        dots.forEach((dot) => this.drawDot(dot));
        lines.forEach((line) => this.drawLine(line));
    }

    private drawDot(dot: Dot): void {
        this.context.fillStyle = "gray";

        this.context.beginPath();
        this.context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        this.context.fill();
        this.context.closePath();
    }

    private drawLine(line: Line): void {
        if (line.type === MousePositionType.BACK) {
            return; //TODO: !!!!
        }
        
        this.context.beginPath();

        const from = line.from;
        this.context.moveTo(from.x, from.y);

        const to = line.to;
        this.context.lineTo(to.x, to.y);

        this.context.lineWidth = line.from.radius;
        this.context.strokeStyle = "gray";
        this.context.stroke();
    }
}
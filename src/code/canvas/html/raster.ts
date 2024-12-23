import { Dot, Line } from "../virtual/types";

export class RasterCanvas {
    private readonly context: CanvasRenderingContext2D;

    constructor(private htmlCanvas: HTMLCanvasElement) {
        this.context = htmlCanvas.getContext("2d")!;
    }

    public clear(): void {
        this.context.clearRect(0, 0, this.htmlCanvas.clientWidth, this.htmlCanvas.clientWidth);
    }

    public drawDot(dot: Dot): void {
        this.context.fillStyle = "gray";

        this.context.beginPath();
        this.context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        this.context.fill();
        this.context.closePath();
    }

    public drawLine(line: Line): void {
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
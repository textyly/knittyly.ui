import { VirtualCanvas } from "./base.js";
import { CanvasSide, Dot, Line, Link } from "./types.js";
import {
    ITransparentCanvas,
    MouseMoveEvent,
    MouseLeftButtonDownEvent,
    Position,
} from "../transparent/types.js";

export class VirtualDrawing extends VirtualCanvas {
    // #region fields 
    private dots: Map<string, Dot>;

    private dotRadius: number;
    private dotSpacing: number;
    private hoveredDot?: Dot & { originalDot: Dot }; // TODO: ugly!!!
    private clickedDot?: Dot;

    private nextId: number;
    private link?: Link;

    private lines: Array<Line>;
    private side: CanvasSide;

    //#endregion

    constructor(private canvas: ITransparentCanvas) {
        super(canvas.size.width, canvas.size.height);

        this.nextId = 0;
        this.lines = [];

        this.dotRadius = 2;
        this.dotSpacing = 20;
        this.dots = new Map<string, Dot>;

        this.side = CanvasSide.Back;
    }

    // #region abstract overrides

    protected override initializeCore(): void {
        this.subscribe();
    }

    protected override disposeCore(): void {
        // do nothing
    }

    // #endregion

    // #region events

    private subscribe(): void {
        const zoomInUn = this.canvas.onZoomIn(this.handleZoomIn.bind(this));
        super.registerUn(zoomInUn);

        const zoomOutUn = this.canvas.onZoomOut(this.handleZoomOut.bind(this));
        super.registerUn(zoomOutUn);

        const mouseMoveUn = this.canvas.onMouseMove(this.handleMouseMove.bind(this));
        super.registerUn(mouseMoveUn);

        const mouseLeftButtonDownUn = this.canvas.onMouseLeftButtonDown(this.handleMouseLeftButtonDown.bind(this));
        super.registerUn(mouseLeftButtonDownUn);
    }

    private handleMouseMove(event: MouseMoveEvent) {
        const position = event.position;
        this.handleDotChanged(position);
        this.handleLinkChanged(position);
    }

    // TODO: ugly code!!!
    private handleDotChanged(position: Position): void {
        const dot = this.getDot(position.x, position.y);
        if (dot) {
            if (dot.id !== this.hoveredDot?.id && dot.id !== this.hoveredDot?.originalDot?.id) {
                this.hoveredDot = { x: dot.x, y: dot.y, radius: dot.radius + 2, id: this.getNextId(), originalDot: dot };
                const dotHoveredEvent = { dot: this.hoveredDot };
                super.invokeDotHovered(dotHoveredEvent);
            }
        } else if (this.hoveredDot) {
            const dotUnhoveredEvent = { dot: this.hoveredDot };
            super.invokeDotUnhovered(dotUnhoveredEvent);
            this.hoveredDot = undefined;
        }
    }

    private handleLinkChanged(position: Position): void {
        if (!this.clickedDot) {
            return;
        }

        if (this.link) {
            super.invokeRemoveLink({ link: this.link });
        }

        const id = this.getNextId();
        const from = this.clickedDot;
        const to = { id: this.getNextId(), x: position.x, y: position.y, radius: this.dotRadius };
        const side = this.side;

        this.link = { id, from, to, side };
        super.invokeDrawLink({ link: this.link });
    }

    // TODO: extremely bad code, refactor !!!
    private handleMouseLeftButtonDown(event: MouseLeftButtonDownEvent): void {
        const position = event.position;
        const dot = this.getDot(position.x, position.y);

        if (!dot) {
            // don't care
            return;
        }

        if (!this.clickedDot) {
            // TODO: check this case when clicking on the same dot multiple times
            this.clickedDot = dot;
            this.side = CanvasSide.Front;
            return;
        }

        const line = { from: this.clickedDot, to: dot, side: this.side };
        this.lines.push(line);
        super.invokeDrawLine({ line });

        this.side = this.side === CanvasSide.Front ? CanvasSide.Back : CanvasSide.Front;

        this.clickedDot = dot;
    }

    private handleZoomIn(): void {
        // TODO: width and height calculations are not correct here
        const width = this.canvas.size.width + 2;
        const height = this.canvas.size.height + 2;

        // set a new size for all headless canvases
        this.canvas.size = { width, height };

        this.dotSpacing += 2;
        this.dotRadius += 0.2;

        // inform all visible canvases that size, dots and line has been changed
        this.draw();
    }

    private handleZoomOut(): void {
        // TODO: width and height calculations are not correct here
        const width = this.canvas.size.width + 2;
        const height = this.canvas.size.height + 2;

        // set a new size for all headless canvases
        this.canvas.size = { width, height };

        this.dotSpacing -= 2;
        this.dotRadius -= 0.2;

        // inform all visible canvases that size, dots and lines has been changed
        this.draw();
    }

    // #endregion

    // #region methods

    public draw(): void {
        // clear the canvas
        super.invokeRedraw();

        // draw dots
        this.dots = this.createDots();
        this.dots.forEach((dot) => {
            const dotEvent = { dot };
            super.invokeDrawDot(dotEvent);
        });

        //draw lines
        this.lines = this.createLines();
        this.lines.forEach((line) => {
            const lineEvent = { line };
            super.invokeDrawLine(lineEvent);
        });
    }


    private createDots(): Map<string, Dot> {
        const dots = new Map<string, Dot>();

        for (let y = this.dotSpacing; y < this.canvas.size.height; y += this.dotSpacing) {
            for (let x = this.dotSpacing; x < this.canvas.size.width; x += this.dotSpacing) {
                const id = this.getNextId();
                const dot = { id, x, y, radius: this.dotRadius };
                dots.set(id, dot);
            }
        }

        return dots;
    }

    private createLines(): Array<Line> {
        const lines = new Array<Line>();

        this.lines.forEach((line) => {
            const from = this.dots.get(line.from.id)!; // TODO: what if undefined ???
            const to = this.dots.get(line.to.id)!; // TODO: what if undefined ???
            const l = { from, to, side: line.side };
            lines.push(l);
        });

        return lines;
    }

    // TODO: try to find a better algorithm
    private getDot(x: number, y: number): Dot | undefined {
        for (const dotKvp of this.dots) {
            const dot = dotKvp[1];
            const distance = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
            let isInside = distance <= dot.radius;
            if (isInside) {
                return dot;
            }
        }
    }

    private getNextId(): string {
        const id = ++this.nextId;
        const strId = id.toString();
        return strId;
    }

    // #endregion
}
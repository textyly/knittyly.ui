import { VirtualCanvasBase } from "./base.js";
import { Dot, Line, Link, MousePositionType } from "./types.js";
import { VoidUnsubscribe } from "../../utilities/messaging/types.js";
import {
    IHeadlessCanvas,
    MouseMoveEvent,
    MouseLeftButtonDownEvent,
    Position,
} from "../headless/types.js";

export class VirtualCanvas extends VirtualCanvasBase {
    // #region fields 
    private dots: Map<number, Dot>;

    private dotRadius: number;
    private dotSpacing: number;
    private hoveredDot?: Dot & { originalDot: Dot }; // TODO: ugly!!!
    private clickedDot?: Dot;

    private nextId: number;
    private link?: Link;

    private lines: Array<Line>;

    private mousePosition: MousePositionType;

    private unFuncs: Array<VoidUnsubscribe>;

    //#endregion

    constructor(private canvas: IHeadlessCanvas) {
        super();

        this.nextId = 0;
        this.lines = [];

        this.dotRadius = 2;
        this.dotSpacing = 20;
        this.dots = new Map<number, Dot>;

        this.mousePosition = MousePositionType.BACK;

        this.unFuncs = [];
    }

    // #region abstract overrides

    protected override initializeCore(): void {
        this.subscribe();
    }

    protected override disposeCore(): void {
        this.unsubscribe();
    }

    // #endregion

    // #region events

    private subscribe(): void {
        const zoomInUn = this.canvas.onZoomIn(this.handleZoomIn.bind(this));
        this.unFuncs.push(zoomInUn);

        const zoomOutUn = this.canvas.onZoomOut(this.handleZoomOut.bind(this));
        this.unFuncs.push(zoomOutUn);

        const mouseMoveUn = this.canvas.onMouseMove(this.handleMouseMove.bind(this));
        this.unFuncs.push(mouseMoveUn);

        const mouseLeftButtonDownUn = this.canvas.onMouseLeftButtonDown(this.handleMouseLeftButtonDown.bind(this));
        this.unFuncs.push(mouseLeftButtonDownUn);
    }

    private unsubscribe(): void {
        this.unFuncs.forEach((un) => un());
        this.unFuncs = [];
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
                this.hoveredDot = { x: dot.x, y: dot.y, radius: dot.radius + 2, id: ++this.nextId, originalDot: dot };
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
        if (this.clickedDot) {
            if (this.link) {
                super.invokeRemoveLink({ link: this.link });
            }

            this.link = { id: (this.nextId += 1), from: this.clickedDot, to: { id: ++this.nextId, x: position.x, y: position.y, radius: this.dotRadius }, type: this.mousePosition };
            super.invokeDrawLink({ link: this.link });
        }
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
            this.mousePosition = MousePositionType.FRONT;
            return;
        }

        const line = { from: this.clickedDot, to: dot, type: this.mousePosition };
        this.lines.push(line);
        super.invokeDrawLine({ line });

        this.mousePosition = this.mousePosition == MousePositionType.FRONT
            ? MousePositionType.BACK
            : MousePositionType.FRONT;

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
        this.dots = this.createDots();
        this.lines = this.createLines();

        const drawGridEvent = { dots: [...this.dots.values()], lines: [...this.lines.values()] };
        super.invokeDrawGrid(drawGridEvent);
    }


    private createDots(): Map<number, Dot> {
        const dots = new Map<number, Dot>();

        for (let y = this.dotSpacing; y < this.canvas.size.height; y += this.dotSpacing) {
            for (let x = this.dotSpacing; x < this.canvas.size.width; x += this.dotSpacing) {
                const id = ++this.nextId;
                dots.set(id, { id, x, y, radius: this.dotRadius });
            }
        }

        return dots;
    }

    private createLines(): Array<Line> {
        const lines = new Array<Line>();

        this.lines.forEach((line) => {
            const from = this.dots.get(line.from.id)!; // TODO: what if undefined ???
            const to = this.dots.get(line.to.id)!; // TODO: what if undefined ???
            lines.push({ from, to, type: line.type });
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

    // #endregion
}
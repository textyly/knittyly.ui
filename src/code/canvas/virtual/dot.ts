import { Dot, Id } from "./types.js";
import { VirtualCanvas } from "./base.js";
import { MouseLeftButtonDownEvent, MouseMoveEvent, } from "../transparent/types.js";
import { IdGenerator } from "../../utilities/generator.js";

export class VirtualDotCanvas extends VirtualCanvas {
    // #region fields

    private dots: Map<Id, Dot>;

    private idGenerator: IdGenerator;

    private radius: number;
    private radiusStep: number;

    private spacing: number;
    private spacingStep: number;

    private clicked?: Dot;
    private hovered?: Dot & { originalDot: Dot }; // TODO: ugly!!!

    // #endregion

    constructor(width: number, height: number) {
        super(width, height);

        this.dots = new Map<Id, Dot>;
        this.idGenerator = new IdGenerator();

        this.radius = 2;
        this.radiusStep = 0.2;

        this.spacing = 20;
        this.spacingStep = 2;
    }

    public get dotRadius(): number {
        return this.radius;
    }

    public get clickedDot(): Dot | undefined {
        return this.clicked;
    }

    public get hoveredDot(): Dot | undefined | undefined {
        return this.hovered?.originalDot;
    }

    public get(id: Id): Dot | undefined {
        return this.dots.get(id);
    }

    // #region interface

    public draw(): void {
        this.idGenerator.reset();

        this.dots = this.createDots();
        this.dots.forEach((dot) => {
            const dotEvent = { dot };
            super.invokeDrawDot(dotEvent);
        });
    }

    public invokeZoomIn(): void {
        this.radius += this.radiusStep;
        this.spacing += this.spacingStep;

        // set a new size for all headless canvases
        // super.size = // TODO: calculate new size

        // inform all visible canvases that size, dots and line has been changed
        this.draw();
    }

    public invokeZoomOut(): void {
        this.radius -= this.radiusStep;
        this.spacing -= this.spacingStep;

        // set a new size for all headless canvases
        // super.size = // TODO: calculate new size

        // inform all visible canvases that size, dots and lines has been changed
        this.draw();
    }

    // TODO: ugly code!!!
    public invokeMouseMove(event: MouseMoveEvent): void {
        const position = event.position;
        const dot = this.getDot(position.x, position.y);
        if (dot) {
            if (dot.id !== this.hovered?.id && dot.id !== this.hovered?.originalDot?.id) {
                const id = this.idGenerator.next();
                this.hovered = { x: dot.x, y: dot.y, radius: dot.radius + 2, id, originalDot: dot };
                const dotHoveredEvent = { dot: this.hovered };
                super.invokeHoverDot(dotHoveredEvent);
            }
        } else if (this.hovered) {
            const dotUnhoveredEvent = { dot: this.hovered };
            super.invokeUnhoverDot(dotUnhoveredEvent);
            this.hovered = undefined;
        }
    }

    public invokeMouseLeftButtonDown(event: MouseLeftButtonDownEvent): void {
        const position = event.position;
        const dot = this.getDot(position.x, position.y);
        if (dot) {
            this.clicked = dot;
        }
    }

    // #endregion

    // #region overrides

    protected override initializeCore(): void {
        // TODO: implement
    }

    protected override disposeCore(): void {
        this.dots.clear();
    }

    // #endregion 

    // #region methods

    private createDots(): Map<string, Dot> {
        const dots = new Map<string, Dot>();

        for (let y = this.spacing; y < super.size.height; y += this.spacing) {
            for (let x = this.spacing; x < super.size.width; x += this.spacing) {
                const id = this.idGenerator.next();
                const dot = { id, x, y, radius: this.radius };
                dots.set(id, dot);
            }
        }

        return dots;
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
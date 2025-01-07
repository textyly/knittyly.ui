import { DotGrid } from "../../grid/dot.js";
import { VirtualCanvas } from "./base.js";
import { IdGenerator } from "../../utilities/generator.js";
import { Dot, DotsConfig, Id } from "./types.js";
import { MouseLeftButtonDownEvent, MouseMoveEvent, } from "../transparent/types.js";

// TODO: ugly code!!!
export class VirtualDotCanvas extends VirtualCanvas {
    // #region fields

    private readonly dotGrid: DotGrid;
    private idGenerator: IdGenerator;

    private clicked?: Id;
    private hovered?: { id: Id } & { originalDot: Id }; // TODO: ugly!!!

    // #endregion

    constructor(config: DotsConfig) {
        super();

        this.dotGrid = new DotGrid(config);

        this.idGenerator = new IdGenerator();
    }

    public get clickedDot(): Dot | undefined {
        const clicked = this.dotGrid.getDotById(this.clicked!); // TODO: !!!
        return clicked;
    }

    public get hoveredDot(): Dot | undefined {
        const hovered = this.dotGrid.getDotById(this.hovered?.originalDot!); // TODO: !!!
        return hovered;
    }

    public get(id: Id): Dot | undefined {
        return this.dotGrid.getDotById(id);
    }

    // #region interface

    public draw(): void {
        // TODO: !!!
        const width = this.dotGrid.width;
        const height = this.dotGrid.height;
        const size = { width, height };

        super.size = size;

        [...this.dotGrid.dots.values()].forEach((dot) => {
            const dotEvent = { dot };
            super.invokeDrawDot(dotEvent);
        });
    }

    public invokeZoomIn(): void {
        const x = this.dotGrid.x;
        const y = this.dotGrid.y;
        const radius = this.dotGrid.radius + this.dotGrid.config.radius.step;
        const spacing = this.dotGrid.spacing + this.dotGrid.config.spacing.step;

        this.dotGrid.recalculate(x, y, radius, spacing);
        this.draw();
    }

    public invokeZoomOut(): void {
        const x = this.dotGrid.x;
        const y = this.dotGrid.y;
        const radius = this.dotGrid.radius - this.dotGrid.config.radius.step;
        const spacing = this.dotGrid.spacing - this.dotGrid.config.spacing.step;

        this.dotGrid.recalculate(x, y, radius, spacing);
        this.draw();
    }

    // TODO: ugly code!!!
    public invokeMouseMove(event: MouseMoveEvent): void {
        const position = event.position;
        const dot = this.dotGrid.getDotByCoordinates(position.x, position.y);
        if (dot) {
            if (dot.id !== this.hovered?.id && dot.id !== this.hovered?.originalDot) {
                const id = this.idGenerator.next();
                this.hovered = { id, originalDot: dot.id };
                const dotHoveredEvent = { dot: { id: this.hovered.id, x: dot.x, y: dot.y, radius: dot.radius + 2 } };
                super.invokeHoverDot(dotHoveredEvent);
            }
        } else if (this.hoveredDot) {
            const dotUnhoveredEvent = { dot: { ...this.hoveredDot } };
            dotUnhoveredEvent.dot.id = this.hovered?.id!;
            super.invokeUnhoverDot(dotUnhoveredEvent);
            this.hovered = undefined;
        }
    }

    public invokeMouseLeftButtonDown(event: MouseLeftButtonDownEvent): void {
        const position = event.position;
        const dot = this.dotGrid.getDotByCoordinates(position.x, position.y);
        if (dot) {
            this.clicked = dot.id;
        }
    }

    // #endregion

    // #region overrides

    protected override initializeCore(): void {
        // TODO: implement
    }

    protected override sizeChangeCore(): void {
        // TODO: implement
    }

    protected override disposeCore(): void {
        // TODO: implement
    }

    // #endregion 

    // #region methods

    // #endregion
}
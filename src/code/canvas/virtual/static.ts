import { VirtualCanvasBase } from "./base.js";
import { DotVirtualCanvas } from "./dot.js";
import { Dot, DotsConfig, Id } from "./types.js";
import { IdGenerator } from "../../utilities/generator.js";
import { MouseLeftButtonDownEvent, MouseMoveEvent, } from "../input/types.js";

// TODO: ugly code!!!
export class StaticVirtualCanvas extends VirtualCanvasBase {
    // #region fields

    private readonly ids: IdGenerator;
    private readonly dotVirtualCanvas: DotVirtualCanvas;

    private clicked?: Id;
    private hovered?: { id: Id } & { originalDot: Id }; // TODO: ugly!!!

    // #endregion

    constructor(private config: DotsConfig) {
        super();

        this.ids = new IdGenerator();
        this.dotVirtualCanvas = new DotVirtualCanvas();
    }

    public get clickedDot(): Dot | undefined {
        const clicked = this.dotVirtualCanvas.getDotById(this.clicked!); // TODO: !!!
        return clicked;
    }

    public get hoveredDot(): Dot | undefined {
        const hovered = this.dotVirtualCanvas.getDotById(this.hovered?.originalDot!); // TODO: !!!
        return hovered;
    }

    public get(id: Id): Dot | undefined {
        return this.dotVirtualCanvas.getDotById(id);
    }

    // #region interface

    public draw(): void {
        this.dotVirtualCanvas.draw(this.config.x, this.config.y, this.config.radius.value, this.config.spacing.value);
    }

    protected override initializeCore(): void {
        this.dotVirtualCanvas.onSizeChange((size) => super.size = size);
        this.dotVirtualCanvas.onDrawDot((dot) => super.invokeDrawDot(dot));
    }

    public invokeZoomIn(): void {
        const x = this.dotVirtualCanvas.dotsX;
        const y = this.dotVirtualCanvas.dotsY;
        const radius = this.dotVirtualCanvas.radius + this.config.radius.step;
        const spacing = this.dotVirtualCanvas.spacing + this.config.spacing.step;

        this.dotVirtualCanvas.draw(x, y, radius, spacing);
    }

    public invokeZoomOut(): void {
        const x = this.dotVirtualCanvas.dotsX;
        const y = this.dotVirtualCanvas.dotsY;
        const radius = this.dotVirtualCanvas.radius - this.config.radius.step;
        const spacing = this.dotVirtualCanvas.spacing - this.config.spacing.step;

        this.dotVirtualCanvas.draw(x, y, radius, spacing);
    }

    // TODO: ugly code!!!
    public invokeMouseMove(event: MouseMoveEvent): void {
        const position = event.position;
        const dot = this.dotVirtualCanvas.getDotByCoordinates(position.x, position.y);
        if (dot) {
            if (dot.id !== this.hovered?.id && dot.id !== this.hovered?.originalDot) {
                const id = this.ids.next();
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
        const dot = this.dotVirtualCanvas.getDotByCoordinates(position.x, position.y);
        if (dot) {
            this.clicked = dot.id;
        }
    }

    // #endregion

    // #region methods

    // #endregion
}
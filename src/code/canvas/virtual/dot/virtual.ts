import { DotCanvas } from "../dot/dot.js";
import { VirtualCanvasBase } from "../base.js";
import { Dot, DotsConfig, Id, IDotVirtualCanvas } from "../types.js";
import { IdGenerator } from "../../../utilities/generator.js";
import { MouseLeftButtonDownEvent, MouseMoveEvent, } from "../../input/types.js";

// TODO: ugly code!!!
export class DotVirtualCanvas extends VirtualCanvasBase implements IDotVirtualCanvas {
    // #region fields

    private readonly ids: IdGenerator;
    private readonly config: DotsConfig;
    private readonly dotCanvas: DotCanvas;

    private clicked?: Id;
    private hovered?: { id: Id } & { originalDot: Id }; // TODO: ugly!!!

    // #endregion

    constructor(config: DotsConfig, dotCanvas: DotCanvas) {
        super();
        this.config = config;
        this.dotCanvas = dotCanvas;
        this.ids = new IdGenerator();
    }

    public get clickedDot(): Dot | undefined {
        const clicked = this.dotCanvas.getDotById(this.clicked!); // TODO: !!!
        return clicked;
    }

    public get hoveredDot(): Dot | undefined {
        const hovered = this.dotCanvas.getDotById(this.hovered?.originalDot!); // TODO: !!!
        return hovered;
    }

    public get(id: Id): Dot | undefined {
        return this.dotCanvas.getDotById(id);
    }

    // #region interface

    public draw(): void {
        this.dotCanvas.draw(this.config.x, this.config.y, this.config.radius.value, this.config.spacing.value);
    }

    protected override initializeCore(): void {
        this.dotCanvas.onSizeChange((size) => super.size = size);
        this.dotCanvas.onDrawDot((dot) => super.invokeDrawDot(dot));
    }

    public invokeZoomIn(): void {
        const x = this.dotCanvas.dotsX;
        const y = this.dotCanvas.dotsY;
        const radius = this.dotCanvas.radius + this.config.radius.step;
        const spacing = this.dotCanvas.spacing + this.config.spacing.step;

        this.dotCanvas.draw(x, y, radius, spacing);
    }

    public invokeZoomOut(): void {
        const x = this.dotCanvas.dotsX;
        const y = this.dotCanvas.dotsY;
        const radius = this.dotCanvas.radius - this.config.radius.step;
        const spacing = this.dotCanvas.spacing - this.config.spacing.step;

        this.dotCanvas.draw(x, y, radius, spacing);
    }

    // TODO: ugly code!!!
    public invokeMouseMove(event: MouseMoveEvent): void {
        const position = event.position;
        const dot = this.dotCanvas.getDotByCoordinates(position.x, position.y);
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
        const dot = this.dotCanvas.getDotByCoordinates(position.x, position.y);
        if (dot) {
            this.clicked = dot.id;
        }
    }

    // #endregion

    // #region methods

    // #endregion
}
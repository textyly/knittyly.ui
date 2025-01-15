import { SideVirtualCanvas } from "../../side.js";
import { DotVirtualCanvas } from "../dot/virtual.js";
import { ICueVirtualCanvas, Link } from "../types.js";
import { MouseLeftButtonDownEvent, MouseMoveEvent } from "../../input/types.js";
import { IdGenerator } from "../../../utilities/generator.js";

export class CueVirtualCanvas extends SideVirtualCanvas implements ICueVirtualCanvas {
    // #region fields

    private link?: Link;
    private ids: IdGenerator;

    // #endregion

    constructor(virtualDotCanvas: DotVirtualCanvas) {
        super(virtualDotCanvas);
        this.ids = new IdGenerator();
    }
    // #region interface 

    public draw(): void {
        this.ids.reset();
    }

    public invokeZoomIn(): void {
        this.draw();

        if (this.link) {
            const position = this.link.to;
            this.invokeMouseMove({ position });
        }
    }

    public invokeZoomOut(): void {
        this.draw();

        if (this.link) {
            const position = this.link.to;
            this.invokeMouseMove({ position });
        }
    }

    public invokeMouseMove(event: MouseMoveEvent): void {
        const position = event.position;
        const clickedDot = this.dotVirtualCanvas.clickedDot;

        if (!clickedDot) {
            return;
        }

        if (this.link) {
            super.invokeRemoveLink({ link: this.link });
        }

        const id = this.ids.next();
        const from = clickedDot;
        const to = { id, x: position.x, y: position.y, radius: clickedDot.radius };
        const side = this.side;

        this.link = { id, from, to, side };
        super.invokeDrawLink({ link: this.link });
    }

    public invokeMouseLeftButtonDown(event: MouseLeftButtonDownEvent): void {
        const clickedDot = this.dotVirtualCanvas.clickedDot;

        if (!clickedDot) {
            return;
        }

        const hoveredDot = this.dotVirtualCanvas.hoveredDot;
        if (hoveredDot) {
            super.invokeMouseLeftButtonDown(event);
        }
    }

    // #endregion

    // #region methods

    // #endregion
}
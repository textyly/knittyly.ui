import { CanvasSide, ICueVirtualCanvas, Id, Link } from "./types.js";
import { MouseLeftButtonDownEvent, MouseMoveEvent, Position } from "../input/types.js";
import { VirtualCanvasBase } from "./base.js";
import { DotVirtualCanvas } from "./dot.js";

export class CueVirtualCanvas extends VirtualCanvasBase implements ICueVirtualCanvas {
    private readonly dotVirtualCanvas: DotVirtualCanvas;

    private clicked?: Id;
    private hovered?: Id;
    private link?: Link;
    private side: CanvasSide;

    constructor(dotVirtualCanvas: DotVirtualCanvas) {
        super();
        this.side = CanvasSide.Default;
        this.dotVirtualCanvas = dotVirtualCanvas;
    }

    public draw(): void {
        // TODO: 
    }

    public invokeZoomIn(): void {
        if (this.hovered) {
            this.handleUnhoverDot();
        }
        if (this.link) {
            const position = this.link.to;
            this.handleDrawLink(position);
        }
    }

    public invokeZoomOut(): void {
        if (this.hovered) {
            this.handleUnhoverDot();
        }
        if (this.link) {
            const position = this.link.to;
            this.handleDrawLink(position);
        }
    }

    public invokeMouseMove(event: MouseMoveEvent): void {
        const position = event.position;
        this.handleHoverDot(position);
        this.handleDrawLink(position);
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
                this.side = this.side === CanvasSide.Front ? CanvasSide.Back : CanvasSide.Front;
            }
            this.clicked = clicked.id;
        }
    }

    private handleDrawLink(position: Position): void {
        if (this.clicked) {
            if (this.link) {
                this.handleRemoveLink(this.link);
            }

            const clicked = this.dotVirtualCanvas.getDotById(this.clicked!)!;
            const from = clicked;
            const to = { ...position, id: "111", radius: clicked.radius };
            this.link = { id: "111", from, to, side: this.side };
            const drawLinkEvent = { link: this.link };
            super.invokeDrawLink(drawLinkEvent);
        }
    }

    private handleRemoveLink(link: Link) {
        super.invokeRemoveLink({ link });
        this.link = undefined;
    }

    private handleHoverDot(position: Position): void {
        const hovered = this.dotVirtualCanvas.getDotByCoordinates(position.x, position.y);
        if (hovered) {
            if (hovered.id !== this.hovered) {
                this.hovered = hovered.id;
                const hoverEvent = { dot: { id: hovered.id, radius: hovered.radius + 2, x: hovered.x, y: hovered.y } };
                super.invokeHoverDot(hoverEvent);
            }
        } else if (this.hovered) {
            this.handleUnhoverDot();
        }
    }

    private handleUnhoverDot(): void {
        const hovered = this.dotVirtualCanvas.getDotById(this.hovered!)!;
        const unhoverEvent = { dot: hovered };
        super.invokeUnhoverDot(unhoverEvent);
        this.hovered = undefined;
    }
}
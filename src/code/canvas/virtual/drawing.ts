import { VirtualCanvas } from "./base.js";
import { DotVirtualCanvas } from "./dot.js";
import { CueVirtualCanvas } from "./cue.js";
import { ITransparentCanvas, MouseMoveEvent } from "../transparent/types.js";
import {
    DrawDotEvent,
    DrawLineEvent,
    DrawLinkEvent,
    HoverDotEvent,
    RemoveLinkEvent,
    UnhoverDotEvent
} from "./types.js";

export class VirtualDrawing extends VirtualCanvas {
    // #region fields 

    private transparentCanvas: ITransparentCanvas
    private dotVirtualCanvas: DotVirtualCanvas;
    private cueVirtualCanvas: CueVirtualCanvas;

    //#endregion

    constructor(transparentCanvas: ITransparentCanvas) {
        super(transparentCanvas.size.width, transparentCanvas.size.height);

        this.transparentCanvas = transparentCanvas;
        this.dotVirtualCanvas = new DotVirtualCanvas(super.size.width, super.size.height);
        this.cueVirtualCanvas = new CueVirtualCanvas(this.dotVirtualCanvas);
    }

    // #region interface

    public draw(): void {
        super.invokeRedraw();
        this.dotVirtualCanvas.draw();
        this.cueVirtualCanvas.draw();
    }

    // #endregion 

    // #region overrides

    protected override initializeCore(): void {
        this.dotVirtualCanvas.initialize();
        this.cueVirtualCanvas.initialize();
        this.subscribe();
    }

    protected override disposeCore(): void {
        this.unsubscribe();
        this.cueVirtualCanvas.dispose();
        this.dotVirtualCanvas.dispose();
    }

    // #endregion

    // #region events

    private handleZoomIn(): void {
        super.invokeRedraw();
        this.dotVirtualCanvas.invokeZoomIn();
        this.cueVirtualCanvas.invokeZoomIn();
    }

    private handleZoomOut(): void {
        super.invokeRedraw();
        this.dotVirtualCanvas.invokeZoomOut();
        this.cueVirtualCanvas.invokeZoomOut();
    }

    private handleMouseMove(event: MouseMoveEvent): void {
        this.dotVirtualCanvas.invokeMouseMove(event);
        this.cueVirtualCanvas.invokeMouseMove(event);
    }

    private handleMouseLeftButtonDown(event: MouseMoveEvent): void {
        this.cueVirtualCanvas.invokeMouseLeftButtonDown(event);
        this.dotVirtualCanvas.invokeMouseLeftButtonDown(event);
    }

    private handleDrawDot(event: DrawDotEvent): void {
        const dot = event.dot;
        super.invokeDrawDot({ dot });
    }

    private handleDrawLine(event: DrawLineEvent): void {
        const line = event.line;
        super.invokeDrawLine({ line });
    }

    private handleDrawLink(event: DrawLinkEvent): void {
        const link = event.link;
        super.invokeDrawLink({ link });
    }

    private handleRemoveLink(event: RemoveLinkEvent): void {
        const link = event.link;
        super.invokeRemoveLink({ link });
    }

    private handleHoverDot(event: HoverDotEvent): void {
        const dot = event.dot;
        super.invokeHoverDot({ dot });
    }

    private handleUnhoverDot(event: UnhoverDotEvent): void {
        const dot = event.dot;
        super.invokeUnhoverDot({ dot });
    }

    // #endregion

    // #region methods

    private subscribe(): void {
        const zoomInUn = this.transparentCanvas.onZoomIn(this.handleZoomIn.bind(this));
        super.registerUn(zoomInUn);

        const zoomOutUn = this.transparentCanvas.onZoomOut(this.handleZoomOut.bind(this));
        super.registerUn(zoomOutUn);

        const mouseMoveUn = this.transparentCanvas.onMouseMove(this.handleMouseMove.bind(this));
        super.registerUn(mouseMoveUn);

        const mouseLeftButtonDownUn = this.transparentCanvas.onMouseLeftButtonDown(this.handleMouseLeftButtonDown.bind(this));
        super.registerUn(mouseLeftButtonDownUn);

        const drawDotUn = this.dotVirtualCanvas.onDrawDot(this.handleDrawDot.bind(this));
        super.registerUn(drawDotUn);

        const drawLineUn = this.cueVirtualCanvas.onDrawLine(this.handleDrawLine.bind(this));
        super.registerUn(drawLineUn);

        const drawLinkUn = this.cueVirtualCanvas.onDrawLink(this.handleDrawLink.bind(this));
        super.registerUn(drawLinkUn);

        const removeLinkUn = this.cueVirtualCanvas.onRemoveLink(this.handleRemoveLink.bind(this));
        super.registerUn(removeLinkUn);

        const hoverDotUn = this.dotVirtualCanvas.onHoverDot(this.handleHoverDot.bind(this));
        super.registerUn(hoverDotUn);

        const unhoverDotUn = this.dotVirtualCanvas.onUnhoverDot(this.handleUnhoverDot.bind(this));
        super.registerUn(unhoverDotUn);
    }

    private unsubscribe(): void {
        // base class will unsubscribe
    }

    // #endregion
}
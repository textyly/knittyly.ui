import { VirtualCanvas } from "./base.js";
import { VirtualDotCanvas } from "./dot.js";
import { VirtualCueCanvas } from "./cue.js";
import { ITransparentCanvas, MouseMoveEvent } from "../transparent/types.js";
import {
    DrawDotEvent,
    DrawLineEvent,
    DrawLinkEvent,
    HoverDotEvent,
    RemoveLinkEvent,
    UnhoverDotEvent
} from "./types.js";
import { Size } from "../types.js";

export class VirtualDrawing extends VirtualCanvas {
    // #region fields 

    private transparentCanvas: ITransparentCanvas
    private virtualDotCanvas: VirtualDotCanvas;
    private virtualCueCanvas: VirtualCueCanvas;

    //#endregion

    constructor(transparentCanvas: ITransparentCanvas) {
        super(transparentCanvas.size.width, transparentCanvas.size.height);

        this.transparentCanvas = transparentCanvas;
        this.virtualDotCanvas = new VirtualDotCanvas(super.size.width, super.size.height);
        this.virtualCueCanvas = new VirtualCueCanvas(this.virtualDotCanvas);
    }

    // #region interface

    public draw(): void {
        super.invokeRedraw();
        this.virtualDotCanvas.draw();
        this.virtualCueCanvas.draw();
    }

    // #endregion 

    // #region overrides

    protected override initializeCore(): void {
        this.virtualDotCanvas.initialize();
        this.virtualCueCanvas.initialize();
        this.subscribe();
    }

    protected override disposeCore(): void {
        this.unsubscribe();
        this.virtualCueCanvas.dispose();
        this.virtualDotCanvas.dispose();
    }

    // #endregion

    // #region events

    private handleZoomIn(): void {
        super.invokeRedraw();
        this.virtualDotCanvas.invokeZoomIn();
        this.virtualCueCanvas.invokeZoomIn();
    }

    private handleZoomOut(): void {
        super.invokeRedraw();
        this.virtualDotCanvas.invokeZoomOut();
        this.virtualCueCanvas.invokeZoomOut();
    }

    private handleMouseMove(event: MouseMoveEvent): void {
        this.virtualDotCanvas.invokeMouseMove(event);
        this.virtualCueCanvas.invokeMouseMove(event);
    }

    private handleMouseLeftButtonDown(event: MouseMoveEvent): void {
        this.virtualCueCanvas.invokeMouseLeftButtonDown(event);
        this.virtualDotCanvas.invokeMouseLeftButtonDown(event);
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

    private handleSizeChanged(size: Size): void {
        this.transparentCanvas.size = size;
        this.virtualDotCanvas.size = size;
        this.virtualCueCanvas.size = size;
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

        const drawDotUn = this.virtualDotCanvas.onDrawDot(this.handleDrawDot.bind(this));
        super.registerUn(drawDotUn);

        const drawLineUn = this.virtualCueCanvas.onDrawLine(this.handleDrawLine.bind(this));
        super.registerUn(drawLineUn);

        const drawLinkUn = this.virtualCueCanvas.onDrawLink(this.handleDrawLink.bind(this));
        super.registerUn(drawLinkUn);

        const removeLinkUn = this.virtualCueCanvas.onRemoveLink(this.handleRemoveLink.bind(this));
        super.registerUn(removeLinkUn);

        const hoverDotUn = this.virtualDotCanvas.onHoverDot(this.handleHoverDot.bind(this));
        super.registerUn(hoverDotUn);

        const unhoverDotUn = this.virtualDotCanvas.onUnhoverDot(this.handleUnhoverDot.bind(this));
        super.registerUn(unhoverDotUn);

        const sizeChangedUn = super.onSizeChange(this.handleSizeChanged.bind(this));
        super.registerUn(sizeChangedUn);
    }

    private unsubscribe(): void {
        // base class will unsubscribe
    }

    // #endregion
}
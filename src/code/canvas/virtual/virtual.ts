
import { Size } from "../types.js";
import { VirtualCanvasBase } from "./base.js";
import { VirtualDotCanvas } from "./dot.js";
import { VirtualLineCanvas } from "./line.js";
import { IInputCanvas, MouseMoveEvent } from "../input/types.js";
import {
    DotsConfig,
    DrawDotEvent,
    DrawLineEvent,
    DrawLinkEvent,
    HoverDotEvent,
    RemoveLinkEvent,
    UnhoverDotEvent
} from "./types.js";

export class VirtualCanvas extends VirtualCanvasBase {
    // #region fields 

    private input: IInputCanvas
    private virtualDotCanvas: VirtualDotCanvas;
    private virtualLineCanvas: VirtualLineCanvas;

    //#endregion

    constructor(config: DotsConfig, input: IInputCanvas) {
        super();

        this.input = input;
        this.virtualDotCanvas = new VirtualDotCanvas(config);
        this.virtualLineCanvas = new VirtualLineCanvas(this.virtualDotCanvas);
    }

    // #region interface

    public draw(): void {
        super.invokeRedraw();
        this.virtualDotCanvas.draw();
        this.virtualLineCanvas.draw();
    }

    // #endregion 

    // #region overrides

    protected override initializeCore(): void {
        this.virtualDotCanvas.initialize();
        this.virtualLineCanvas.initialize();
        this.subscribe();
    }

    protected override sizeChangeCore(): void {
        const size = super.size;
        this.input.size = size;
        this.virtualDotCanvas.size = size;
        this.virtualLineCanvas.size = size;
    }

    protected override disposeCore(): void {
        this.unsubscribe();
        this.virtualLineCanvas.dispose();
        this.virtualDotCanvas.dispose();
    }

    // #endregion

    // #region events

    private handleZoomIn(): void {
        super.invokeRedraw();
        this.virtualDotCanvas.invokeZoomIn();
        this.virtualLineCanvas.invokeZoomIn();
    }

    private handleZoomOut(): void {
        super.invokeRedraw();
        this.virtualDotCanvas.invokeZoomOut();
        this.virtualLineCanvas.invokeZoomOut();
    }

    private handleMouseMove(event: MouseMoveEvent): void {
        this.virtualDotCanvas.invokeMouseMove(event);
        this.virtualLineCanvas.invokeMouseMove(event);
    }

    private handleMouseLeftButtonDown(event: MouseMoveEvent): void {
        this.virtualLineCanvas.invokeMouseLeftButtonDown(event);
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

    private handleSizeChange(size: Size): void {
        super.size = size;
    }

    // #endregion

    // #region methods

    private subscribe(): void {
        const zoomInUn = this.input.onZoomIn(this.handleZoomIn.bind(this));
        super.registerUn(zoomInUn);

        const zoomOutUn = this.input.onZoomOut(this.handleZoomOut.bind(this));
        super.registerUn(zoomOutUn);

        const mouseMoveUn = this.input.onMouseMove(this.handleMouseMove.bind(this));
        super.registerUn(mouseMoveUn);

        const mouseLeftButtonDownUn = this.input.onMouseLeftButtonDown(this.handleMouseLeftButtonDown.bind(this));
        super.registerUn(mouseLeftButtonDownUn);

        const drawDotUn = this.virtualDotCanvas.onDrawDot(this.handleDrawDot.bind(this));
        super.registerUn(drawDotUn);

        const drawLineUn = this.virtualLineCanvas.onDrawLine(this.handleDrawLine.bind(this));
        super.registerUn(drawLineUn);

        const drawLinkUn = this.virtualLineCanvas.onDrawLink(this.handleDrawLink.bind(this));
        super.registerUn(drawLinkUn);

        const removeLinkUn = this.virtualLineCanvas.onRemoveLink(this.handleRemoveLink.bind(this));
        super.registerUn(removeLinkUn);

        const hoverDotUn = this.virtualDotCanvas.onHoverDot(this.handleHoverDot.bind(this));
        super.registerUn(hoverDotUn);

        const unhoverDotUn = this.virtualDotCanvas.onUnhoverDot(this.handleUnhoverDot.bind(this));
        super.registerUn(unhoverDotUn);

        const dotCanvasSizeChangedUn = this.virtualDotCanvas.onSizeChange(this.handleSizeChange.bind(this));
        super.registerUn(dotCanvasSizeChangedUn);
    }

    private unsubscribe(): void {
        // base class will unsubscribe
    }

    // #endregion
}
import { Size } from "../types.js";
import { DotCanvas } from "./dot/dot.js";
import { CueVirtualCanvas } from "./cue/cue.js";
import { LineVirtualCanvas } from "./line/line.js";
import { VirtualCanvasBase } from "./base.js";
import { DotVirtualCanvas } from "./dot/virtual.js";
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
    private dotVirtualCanvas: DotVirtualCanvas;
    private lineVirtualCanvas: LineVirtualCanvas;
    private cueVirtualCanvas: CueVirtualCanvas;

    //#endregion

    constructor(config: DotsConfig, input: IInputCanvas) {
        super();

        this.input = input;

        const dotCanvas = new DotCanvas();
        this.dotVirtualCanvas = new DotVirtualCanvas(config, dotCanvas);
        this.lineVirtualCanvas = new LineVirtualCanvas(this.dotVirtualCanvas);
        this.cueVirtualCanvas = new CueVirtualCanvas(this.dotVirtualCanvas);
    }

    // #region interface

    public draw(): void {
        super.invokeRedraw();
        this.dotVirtualCanvas.draw();
        this.lineVirtualCanvas.draw();
        this.cueVirtualCanvas.draw();
    }

    // #endregion 

    // #region overrides

    protected override initializeCore(): void {
        this.dotVirtualCanvas.initialize();
        this.lineVirtualCanvas.initialize();
        this.cueVirtualCanvas.initialize();
        this.subscribe();
    }

    protected override sizeChangeCore(): void {
        const size = super.size;
        this.input.size = size;
        this.dotVirtualCanvas.size = size;
        this.lineVirtualCanvas.size = size;
        this.cueVirtualCanvas.size = size;
    }

    protected override disposeCore(): void {
        this.unsubscribe();
        this.cueVirtualCanvas.dispose();
        this.lineVirtualCanvas.dispose();
        this.dotVirtualCanvas.dispose();
    }

    // #endregion

    // #region events

    private handleZoomIn(): void {
        super.invokeRedraw();
        this.dotVirtualCanvas.invokeZoomIn();
        this.lineVirtualCanvas.invokeZoomIn();
        this.cueVirtualCanvas.invokeZoomIn();
    }

    private handleZoomOut(): void {
        super.invokeRedraw();
        this.dotVirtualCanvas.invokeZoomOut();
        this.lineVirtualCanvas.invokeZoomOut();
        this.cueVirtualCanvas.invokeZoomOut();
    }

    private handleMouseMove(event: MouseMoveEvent): void {
        this.dotVirtualCanvas.invokeMouseMove(event);
        this.cueVirtualCanvas.invokeMouseMove(event);
    }

    private handleMouseLeftButtonDown(event: MouseMoveEvent): void {
        this.cueVirtualCanvas.invokeMouseLeftButtonDown(event);
        this.lineVirtualCanvas.invokeMouseLeftButtonDown(event); // TODO: ???
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

        const drawDotUn = this.dotVirtualCanvas.onDrawDot(this.handleDrawDot.bind(this));
        super.registerUn(drawDotUn);

        const drawLineUn = this.lineVirtualCanvas.onDrawLine(this.handleDrawLine.bind(this));
        super.registerUn(drawLineUn);

        const drawLinkUn = this.cueVirtualCanvas.onDrawLink(this.handleDrawLink.bind(this));
        super.registerUn(drawLinkUn);

        const removeLinkUn = this.cueVirtualCanvas.onRemoveLink(this.handleRemoveLink.bind(this));
        super.registerUn(removeLinkUn);

        const hoverDotUn = this.dotVirtualCanvas.onHoverDot(this.handleHoverDot.bind(this));
        super.registerUn(hoverDotUn);

        const unhoverDotUn = this.dotVirtualCanvas.onUnhoverDot(this.handleUnhoverDot.bind(this));
        super.registerUn(unhoverDotUn);

        const dotCanvasSizeChangedUn = this.dotVirtualCanvas.onSizeChange(this.handleSizeChange.bind(this));
        super.registerUn(dotCanvasSizeChangedUn);
    }

    private unsubscribe(): void {
        // base class will unsubscribe
    }

    // #endregion
}
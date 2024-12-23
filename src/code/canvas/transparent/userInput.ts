import { TransparentCanvas } from "./base.js";
import { HtmlCanvas, HtmlCanvasEvents } from "../visible/types.js";
import { MouseEventHandler, Position, WheelChangeHandler } from "./types.js";

export class UserInputCanvas extends TransparentCanvas {

    //#region fields

    private readonly wheelChangeHandler: WheelChangeHandler;
    private readonly mouseMoveHandler: MouseEventHandler;
    private readonly mouseButtonDownHandler: MouseEventHandler;

    //#endregion

    constructor(private htmlCanvas: HtmlCanvas) {
        super(htmlCanvas.clientWidth, htmlCanvas.clientHeight);

        this.wheelChangeHandler = this.handleWheelChange.bind(this);
        this.mouseMoveHandler = this.handleMouseMove.bind(this);
        this.mouseButtonDownHandler = this.handleMouseButtonDown.bind(this);
    }

    // #region abstract overrides

    protected override initializeCore(): void {
        this.htmlCanvas.addEventListener(HtmlCanvasEvents.WheelChange, this.wheelChangeHandler);
        this.htmlCanvas.addEventListener(HtmlCanvasEvents.MouseMove, this.mouseMoveHandler);
        this.htmlCanvas.addEventListener(HtmlCanvasEvents.MouseDown, this.mouseButtonDownHandler);
    }

    protected override disposeCore(): void {
        this.htmlCanvas.removeEventListener(HtmlCanvasEvents.WheelChange, this.wheelChangeHandler);
        this.htmlCanvas.removeEventListener(HtmlCanvasEvents.MouseMove, this.mouseMoveHandler);
        this.htmlCanvas.removeEventListener(HtmlCanvasEvents.MouseDown, this.mouseButtonDownHandler);
    }

    // #endregion

    // #region events 

    private handleWheelChange(event: WheelEvent): void {
        const deltaY = event.deltaY;
        deltaY < 0 ? super.invokeZoomIn() : super.invokeZoomOut();
    }

    private handleMouseButtonDown(event: MouseEvent): void {
        const leftButton = 0;
        if (event.button === leftButton) {
            const position = this.getPosition(event);
            super.invokeMouseLeftButtonDown({ position });
        }
    }

    private handleMouseMove(event: MouseEvent): void {
        const position = this.getPosition(event);
        super.invokeMouseMove({ position });
    }

    // #endregion

    // #region methods 

    private getPosition(event: MouseEvent): Position {
        const rect = this.htmlCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return { x, y };
    }

    // #endregion
}
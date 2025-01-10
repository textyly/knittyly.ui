import { InputCanvasBase } from "./base.js";
import { ITransparentCanvas, MouseButtonDownEvent, MouseMoveEvent, WheelEvent } from "./types.js";

export class InputCanvas extends InputCanvasBase {

    //#region fields

    private transparentCanvas: ITransparentCanvas;

    //#endregion

    constructor(transparentCanvas: ITransparentCanvas) {
        super();
        this.transparentCanvas = transparentCanvas;
    }

    // #region abstract overrides

    protected override initializeCore(): void {
        const wheelChangeUn = this.transparentCanvas.onWheelChange(this.handleWheelChange.bind(this));
        super.registerUn(wheelChangeUn);

        const mouseMoveUn = this.transparentCanvas.onMouseMove(this.handleMouseMove.bind(this));
        super.registerUn(mouseMoveUn);

        const mouseButtonDownUn = this.transparentCanvas.onMouseButtonDown(this.handleMouseButtonDown.bind(this));
        super.registerUn(mouseButtonDownUn);
    }

    protected override sizeChangeCore(): void {
        this.transparentCanvas.size = super.size;
    }

    protected override disposeCore(): void {
        // baseclass will dispose the event listeners
    }

    // #endregion

    // #region events 

    private handleWheelChange(event: WheelEvent): void {
        const deltaY = event.deltaY;
        deltaY < 0 ? super.invokeZoomIn() : super.invokeZoomOut();
    }

    private handleMouseMove(event: MouseMoveEvent): void {
        super.invokeMouseMove(event);
    }

    private handleMouseButtonDown(event: MouseButtonDownEvent): void {
        const leftButton = 0;
        if (event.button === leftButton) {
            super.invokeMouseLeftButtonDown(event);
        }
    }

    // #endregion

    // #region methods 

    // #endregion
}
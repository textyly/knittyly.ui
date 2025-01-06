import { TransparentCanvas } from "./base.js";
import { ITransparentSvgCanvas } from "../html/types.js";
import { WheelEvent, MouseMoveEvent, MouseButtonDownEvent } from "../html/types.js";
import { Size } from "../types.js";

export class UserInputCanvas extends TransparentCanvas {

    //#region fields

    private transperantSvgCanvas: ITransparentSvgCanvas;

    //#endregion

    constructor(transperantSvgCanvas: ITransparentSvgCanvas) {
        super(transperantSvgCanvas.size.width, transperantSvgCanvas.size.height);

        this.transperantSvgCanvas = transperantSvgCanvas;
    }

    // #region abstract overrides

    protected override initializeCore(): void {
        const wheelChangeUn = this.transperantSvgCanvas.onWheelChange(this.handleWheelChange.bind(this));
        super.registerUn(wheelChangeUn);

        const mouseMoveUn = this.transperantSvgCanvas.onMouseMove(this.handleMouseMove.bind(this));
        super.registerUn(mouseMoveUn);

        const mouseButtonDownUn = this.transperantSvgCanvas.onMouseButtonDown(this.handleMouseButtonDown.bind(this));
        super.registerUn(mouseButtonDownUn);

        const sizeChangedUn = super.onSizeChange(this.handleSizeChange.bind(this));
        super.registerUn(sizeChangedUn);
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

    private handleSizeChange(size: Size): void {
        this.transperantSvgCanvas.size = size;
    }

    // #endregion

    // #region methods 

    // #endregion
}
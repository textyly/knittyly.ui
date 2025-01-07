import { Size } from "../types.js";
import { TransparentCanvas } from "./base.js";
import { ITransparentSvgCanvas } from "../html/types.js";
import { WheelEvent, MouseMoveEvent, MouseButtonDownEvent } from "../html/types.js";

export class UserInputCanvas extends TransparentCanvas {

    //#region fields

    private transperantSvgCanvas: ITransparentSvgCanvas;

    //#endregion

    constructor(transperantSvgCanvas: ITransparentSvgCanvas) {
        super();

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
    }

    protected override sizeChangeCore(): void {
        this.transperantSvgCanvas.size = super.size;
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
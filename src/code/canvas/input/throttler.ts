import { InputCanvasBase } from "./base.js";
import { InputCanvasThrottlerValidator } from "../../validators/canvas/input/throttler.js";
import {
    CanvasEventType,
    IInputCanvas,
    MouseLeftButtonDownEvent,
    MouseMoveEvent,
    Position
} from "./types.js";

export class InputCanvasThrottler extends InputCanvasBase {

    // #region fields

    private inputCanvas: IInputCanvas;
    private groupedEvents: Array<CanvasEvent>;

    private timerInterval: number;
    private timerId?: number;

    private validator: InputCanvasThrottlerValidator;

    // #endregion

    constructor(inputCanvas: IInputCanvas) {
        super();

        this.inputCanvas = inputCanvas;
        this.groupedEvents = [];

        this.timerInterval = 50;

        const className = InputCanvasThrottler.name;
        this.validator = new InputCanvasThrottlerValidator(className);
    }

    // #region abstract overrides 

    protected override initializeCore(): void {
        const zoomInUn = this.inputCanvas.onZoomIn(this.handleZoomIn.bind(this));
        super.registerUn(zoomInUn);

        const zoomOutUn = this.inputCanvas.onZoomOut(this.handleZoomOut.bind(this));
        super.registerUn(zoomOutUn);

        const mouseMoveUn = this.inputCanvas.onMouseMove(this.handleMouseMove.bind(this));
        super.registerUn(mouseMoveUn);

        const mouseLeftButtonDown = this.inputCanvas.onMouseLeftButtonDown(this.handleMouseLeftButtonDown.bind(this));
        super.registerUn(mouseLeftButtonDown);

        this.timerId = setInterval(this.handleTimer.bind(this), this.timerInterval);
    }

    protected override sizeChangeCore(): void {
        this.inputCanvas.size = super.size;
    }

    protected override disposeCore(): void {
        clearInterval(this.timerId);
        this.handleEvents();
    }

    // #endregion

    // #region events 

    private handleZoomIn(): void {
        if (this.groupedEvents.length == 0) {
            this.groupedEvents.push({ type: CanvasEventType.ZoomIn });
        } else {
            const lastEvent = this.groupedEvents.pop()!;

            if (lastEvent.type !== CanvasEventType.ZoomIn) {
                this.groupedEvents.push(lastEvent);
            }

            this.groupedEvents.push({ type: CanvasEventType.ZoomIn });
        }
    }

    private handleZoomOut(): void {
        if (this.groupedEvents.length == 0) {
            this.groupedEvents.push({ type: CanvasEventType.ZoomOut });
        } else {
            const lastEvent = this.groupedEvents.pop()!;

            if (lastEvent.type !== CanvasEventType.ZoomOut) {
                this.groupedEvents.push(lastEvent);
            }

            this.groupedEvents.push({ type: CanvasEventType.ZoomOut });
        }
    }

    private handleMouseMove(event: MouseMoveEvent): void {
        const position = event.position;
        this.validator.validatePosition(position);

        if (this.groupedEvents.length == 0) {
            this.groupedEvents.push({ type: CanvasEventType.MouseMove, value: position });
        } else {
            const lastEvent = this.groupedEvents.pop()!;

            if (lastEvent.type !== CanvasEventType.MouseMove) {
                this.groupedEvents.push(lastEvent);
            }

            this.groupedEvents.push({ type: CanvasEventType.MouseMove, value: position });
        }
    }

    private handleMouseLeftButtonDown(event: MouseLeftButtonDownEvent): void {
        const position = event.position;
        this.validator.validatePosition(position);

        if (this.groupedEvents.length == 0) {
            this.groupedEvents.push({ type: CanvasEventType.MouseLeftButtonDown, value: position });
        } else {
            const lastEvent = this.groupedEvents.pop()!;

            if (lastEvent.type !== CanvasEventType.MouseLeftButtonDown) {
                this.groupedEvents.push(lastEvent);
            }

            this.groupedEvents.push({ type: CanvasEventType.MouseLeftButtonDown, value: position });
        }
    }

    private handleTimer(): void {
        this.handleEvents();
    }

    private handleEvents(): void {
        this.groupedEvents.forEach((event) => this.handleEvent(event));
        this.groupedEvents = [];
    }

    private handleEvent(event: CanvasEvent): void {
        const type = event?.type!;
        const position = event?.value!;

        switch (type) {
            case CanvasEventType.ZoomIn: {
                super.invokeZoomIn();
                break;
            }
            case CanvasEventType.ZoomOut: {
                super.invokeZoomOut();
                break;
            }
            case CanvasEventType.MouseMove: {
                super.invokeMouseMove({ position });
                break;
            }
            case CanvasEventType.MouseLeftButtonDown: {
                super.invokeMouseLeftButtonDown({ position });
                break;
            }
        }
    }

    // #endregion
}

type CanvasEvent = { type: CanvasEventType, value?: Position };
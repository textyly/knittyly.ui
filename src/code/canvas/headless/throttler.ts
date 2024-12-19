import { HeadlessCanvasBase } from "./base.js";
import { Unsubscribe, VoidListener } from "../../utilities/messaging/types.js";
import { HeadlessCanvasThrottlerValidator } from "../../utilities/validators/canvas/headless/throttler.js";
import {
    CanvasEventType,
    IHeadlessCanvas,
    MouseLeftButtonDownEvent,
    MouseMoveEvent,
    Position
} from "./types.js";

export class UserInputCanvasThrottler extends HeadlessCanvasBase {

    // #region fields

    private groupedEvents: Array<CanvasEvent>;
    private unFuncs: Array<Unsubscribe<VoidListener>>;

    private timerInterval: number;
    private timerId?: number;

    private validator: HeadlessCanvasThrottlerValidator;

    // #endregion

    constructor(private canvas: IHeadlessCanvas) {
        super(canvas.size.width, canvas.size.height);

        this.groupedEvents = [];
        this.unFuncs = [];

        this.timerInterval = 50;

        const className = UserInputCanvasThrottler.name;
        this.validator = new HeadlessCanvasThrottlerValidator(className);
    }

    // #region abstract overrides 

    protected override initializeCore(): void {
        const zoomInUn = this.canvas.onZoomIn(this.handleZoomIn.bind(this));
        this.unFuncs.push(zoomInUn);

        const zoomOutUn = this.canvas.onZoomOut(this.handleZoomOut.bind(this));
        this.unFuncs.push(zoomOutUn);

        const mouseMoveUn = this.canvas.onMouseMove(this.handleMouseMove.bind(this));
        this.unFuncs.push(mouseMoveUn);

        const mouseLeftButtonDown = this.canvas.onMouseLeftButtonDown(this.handleMouseLeftButtonDown.bind(this));
        this.unFuncs.push(mouseLeftButtonDown);

        this.timerId = setInterval(this.handleTimer.bind(this), this.timerInterval);
    }

    protected override disposeCore(): void {
        clearInterval(this.timerId);

        this.unFuncs.forEach((un) => un());
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

    private handleMouseMove(event: MouseMoveEvent) {
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
import { Messaging4 } from "../../utilities/messaging/impl.js";
import { IMessaging4, VoidUnsubscribe } from "../../utilities/messaging/types.js";
import { HeadlessCanvasBaseValidator } from "../../utilities/validators/canvas/headless/base.js";
import {
    IHeadlessCanvas,
    MouseLeftButtonDownEvent,
    MouseMoveEvent,
    SizeChangeEvent,
    Size,
    ZoomInListener,
    ZoomOutListener,
    MouseMoveListener,
    MouseLeftButtonDownListener,
    SizeChangeListener
} from "./types.js";


export abstract class HeadlessCanvasBase implements IHeadlessCanvas {
    // #region fields

    private initialized: boolean;
    private readonly messaging: IMessaging4<void, MouseMoveEvent, MouseLeftButtonDownEvent, SizeChangeEvent>;
    private readonly baseValidator: HeadlessCanvasBaseValidator;

    //#endregion

    constructor(private width: number, private height: number) {
        this.initialized = false;

        const className = HeadlessCanvasBase.name;
        this.baseValidator = new HeadlessCanvasBaseValidator(className);

        this.messaging = new Messaging4(className);
        this.messaging.start();
    }

    // #region interface

    public get size(): Size {
        return { width: this.width, height: this.height };
    }

    public set size(value: Size) {
        this.baseValidator.validateSize(value);
        this.width = value.width;
        this.height = value.height;
        this.invokeSizeChange(value);
    }

    public initialize(): void {
        if (!this.initialized) {
            this.initializeCore();
            this.initialized = true;
        }
    }

    public dispose(): void {
        if (this.initialized) {
            this.disposeCore();
            this.messaging.stop();
            this.initialized = false;
        }
    }

    public onZoomIn(listener: ZoomInListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel0(listener);
    }

    public onZoomOut(listener: ZoomOutListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel1(listener);
    }

    public onSizeChange(listener: SizeChangeListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel4(listener);
    }

    public onMouseMove(listener: MouseMoveListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel2(listener);
    }

    public onMouseLeftButtonDown(listener: MouseLeftButtonDownListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel3(listener);
    }

    // #endregion

    // #region abstract

    protected abstract initializeCore(): void;
    protected abstract disposeCore(): void;

    // #endregion

    // #region events

    protected invokeZoomIn(): void {
        this.messaging.sendToChannel0();
    }

    protected invokeZoomOut(): void {
        this.messaging.sendToChannel1();
    }

    protected invokeMouseMove(event: MouseMoveEvent): void {
        this.messaging.sendToChannel2(event);
    }

    protected invokeMouseLeftButtonDown(event: MouseLeftButtonDownEvent): void {
        this.messaging.sendToChannel3(event);
    }

    protected invokeSizeChange(event: SizeChangeEvent): void {
        this.messaging.sendToChannel4(event);
    }

    // #endregion

    // #region methods
    // #endregion 
}
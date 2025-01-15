import { CanvasBase } from "../base.js";
import { VoidUnsubscribe } from "../../types.js";
import { Messaging4 } from "../../messaging/impl.js";
import { IMessaging4 } from "../../messaging/types.js";
import {
    IInputCanvas,
    MouseLeftButtonDownEvent,
    MouseMoveEvent,
    ZoomInListener,
    ZoomOutListener,
    MouseMoveListener,
    MouseLeftButtonDownListener,
    ZoomInEvent,
    ZoomOutEvent
} from "./types.js";


export abstract class InputCanvasBase extends CanvasBase implements IInputCanvas {
    // #region fields

    private readonly messaging: IMessaging4<ZoomInEvent, ZoomOutEvent, MouseMoveEvent, MouseLeftButtonDownEvent>;

    //#endregion

    constructor() {
        super();

        const className = InputCanvasBase.name;
        this.messaging = new Messaging4(className);
        this.messaging.start();
    }

    // #region interface

    public onZoomIn(listener: ZoomInListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel1(listener);
    }

    public onZoomOut(listener: ZoomOutListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel2(listener);
    }

    public onMouseMove(listener: MouseMoveListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel3(listener);
    }

    public onMouseLeftButtonDown(listener: MouseLeftButtonDownListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel4(listener);
    }

    // #endregion

    // #region abstract

    protected abstract initializeCore(): void;
    protected abstract disposeCore(): void;

    // #endregion

    // #region events

    protected invokeZoomIn(): void {
        this.messaging.sendToChannel1({});
    }

    protected invokeZoomOut(): void {
        this.messaging.sendToChannel2({});
    }

    protected invokeMouseMove(event: MouseMoveEvent): void {
        this.messaging.sendToChannel3(event);
    }

    protected invokeMouseLeftButtonDown(event: MouseLeftButtonDownEvent): void {
        this.messaging.sendToChannel4(event);
    }

    // #endregion

    // #region methods
    // #endregion 
}
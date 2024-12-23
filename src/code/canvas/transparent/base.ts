import { Messaging4 } from "../../utilities/messaging/impl.js";
import { IMessaging4, VoidUnsubscribe } from "../../utilities/messaging/types.js";
import { Canvas } from "../base.js";
import {
    ITransparentCanvas,
    MouseLeftButtonDownEvent,
    MouseMoveEvent,
    SizeChangeEvent,
    ZoomInListener,
    ZoomOutListener,
    MouseMoveListener,
    MouseLeftButtonDownListener
} from "./types.js";


export abstract class TransparentCanvas extends Canvas implements ITransparentCanvas {
    // #region fields

    private readonly messaging: IMessaging4<void, MouseMoveEvent, MouseLeftButtonDownEvent, SizeChangeEvent>;

    //#endregion

    constructor(width: number, height: number) {
        super(width, height);

        const className = TransparentCanvas.name;
        this.messaging = new Messaging4(className);
        this.messaging.start();
    }

    // #region interface

    public onZoomIn(listener: ZoomInListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel0(listener);
    }

    public onZoomOut(listener: ZoomOutListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel1(listener);
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

    // #endregion

    // #region methods
    // #endregion 
}
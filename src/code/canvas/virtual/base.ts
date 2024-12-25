import { Messaging6 } from "../../messaging/impl.js";
import { IMessaging6 } from "../../messaging/types.js";
import { VoidListener, VoidUnsubscribe } from "../../types.js";
import { Canvas } from "../base.js";
import { ITransparentCanvas, MouseLeftButtonDownEvent, MouseMoveEvent } from "../transparent/types.js";
import {
    DotHoveredEvent,
    DotHoveredListener,
    DotUnhoveredEvent,
    DotUnhoveredListener,
    IVirtualCanvas,
    DrawLineEvent,
    DrawLineListener,
    DrawLinkEvent,
    DrawLinkListener,
    DrawDotEvent,
    DrawDotListener,
    RemoveLinkListener,
    RemoveLinkEvent
} from "./types.js";

export abstract class VirtualCanvas extends Canvas implements IVirtualCanvas {
    // #region fields

    private readonly messaging: IMessaging6<DrawDotEvent, DrawLineEvent, DrawLinkEvent, RemoveLinkEvent, DotHoveredEvent, DotUnhoveredEvent>;

    // #endregion

    constructor(protected transparentCanvas: ITransparentCanvas) {
        super(transparentCanvas.size.width, transparentCanvas.size.height);

        const className = VirtualCanvas.name;
        this.messaging = new Messaging6(className);
        this.messaging.start();
    }

    // #region interface

    public onRedraw(listener: VoidListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel0(listener);
    }

    public onDrawDot(listener: DrawDotListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel1(listener);
    }

    public onDrawLine(listener: DrawLineListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel2(listener);
    }

    public onDrawLink(listener: DrawLinkListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel3(listener);
    }

    public onRemoveLink(listener: RemoveLinkListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel4(listener);
    }

    public onDotHovered(listener: DotHoveredListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel5(listener);
    }

    public onDotUnhovered(listener: DotUnhoveredListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel6(listener);
    }

    // #endregion

    // #region abstract overrides

    protected override initializeCore(): void {
        this.subscribe();
    }

    protected override disposeCore(): void {
        // do nothing, base class will unsubscribe all listeners
    }

    // #endregion

    // #region abstract

    public abstract draw(): void;

    protected abstract handleZoomIn(): void;
    protected abstract handleZoomOut(): void;
    protected abstract handleMouseMove(event: MouseMoveEvent): void;
    protected abstract handleMouseLeftButtonDown(event: MouseLeftButtonDownEvent): void;

    // #endregion

    // #region events

    protected invokeRedraw(): void {
        this.messaging.sendToChannel0();
    }

    protected invokeDrawDot(event: DrawDotEvent): void {
        this.messaging.sendToChannel1(event);
    }

    protected invokeDrawLine(event: DrawLineEvent): void {
        this.messaging.sendToChannel2(event);
    }

    protected invokeDrawLink(event: DrawLinkEvent): void {
        this.messaging.sendToChannel3(event);
    }

    protected invokeRemoveLink(event: RemoveLinkEvent): void {
        this.messaging.sendToChannel4(event);
    }

    protected invokeDotHovered(event: DotHoveredEvent): void {
        this.messaging.sendToChannel5(event);
    }

    protected invokeDotUnhovered(event: DotUnhoveredEvent): void {
        this.messaging.sendToChannel6(event);
    }

    // #endregion

    // #region methods

    private subscribe(): void {
        const zoomInUn = this.transparentCanvas.onZoomIn(this.handleZoomIn.bind(this));
        super.registerUn(zoomInUn);

        const zoomOutUn = this.transparentCanvas.onZoomOut(this.handleZoomOut.bind(this));
        super.registerUn(zoomOutUn);

        const mouseMoveUn = this.transparentCanvas.onMouseMove(this.handleMouseMove.bind(this));
        super.registerUn(mouseMoveUn);

        const mouseLeftButtonDownUn = this.transparentCanvas.onMouseLeftButtonDown(this.handleMouseLeftButtonDown.bind(this));
        super.registerUn(mouseLeftButtonDownUn);
    }

    // #endregion
}
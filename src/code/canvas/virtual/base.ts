import { Messaging6 } from "../../utilities/messaging/impl.js";
import { IMessaging6, VoidUnsubscribe } from "../../utilities/messaging/types.js";
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
    DrawGridEvent,
    DrawGridListener,
    RemoveLinkListener,
    RemoveLinkEvent
} from "./types.js";

export abstract class VirtualCanvasBase implements IVirtualCanvas {
    // #region fields

    private readonly messaging: IMessaging6<DrawGridEvent, RemoveLinkEvent, DotHoveredEvent, DotUnhoveredEvent, DrawLineEvent, DrawLinkEvent>;

    // #endregion

    constructor() {
        const className = VirtualCanvasBase.name;
        this.messaging = new Messaging6(className);
        this.messaging.start();
    }

    // #region interface

    public initialize(): void {
        this.initializeCore();
    }

    public dispose(): void {
        this.disposeCore();
        this.messaging.stop();
    }

    public onDrawGrid(listener: DrawGridListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel1(listener);
    }

    public onDrawLine(listener: DrawLineListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel5(listener);
    }

    public onDrawLink(listener: DrawLinkListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel6(listener);
    }

    public onRemoveLink(listener: RemoveLinkListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel2(listener);
    }

    public onDotHovered(listener: DotHoveredListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel3(listener);
    }

    public onDotUnhovered(listener: DotUnhoveredListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel4(listener);
    }

    // #endregion

    // #region abstract

    protected abstract initializeCore(): void;
    protected abstract disposeCore(): void;

    // #endregion

    // #region events

    protected invokeDrawGrid(event: DrawGridEvent): void {
        this.messaging.sendToChannel1(event);
    }

    protected invokeDrawLine(event: DrawLineEvent): void {
        this.messaging.sendToChannel5(event);
    }

    protected invokeDrawLink(event: DrawLinkEvent): void {
        this.messaging.sendToChannel6(event);
    }

    protected invokeRemoveLink(event: RemoveLinkEvent): void {
        this.messaging.sendToChannel2(event);
    }

    protected invokeDotHovered(event: DotHoveredEvent): void {
        this.messaging.sendToChannel3(event);
    }

    protected invokeDotUnhovered(event: DotUnhoveredEvent): void {
        this.messaging.sendToChannel4(event);
    }

    // #endregion

    // #region methods

    // #endregion
}
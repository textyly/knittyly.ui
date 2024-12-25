import { Messaging6 } from "../../messaging/impl.js";
import { IMessaging6 } from "../../messaging/types.js";
import { VoidUnsubscribe } from "../../types.js";
import { Canvas } from "../base.js";
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

export abstract class VirtualCanvas extends Canvas implements IVirtualCanvas {
    // #region fields

    private readonly messaging: IMessaging6<DrawGridEvent, DrawLineEvent, DrawLinkEvent, RemoveLinkEvent, DotHoveredEvent, DotUnhoveredEvent>;

    // #endregion

    constructor(width: number, height: number) {
        super(width, height);

        const className = VirtualCanvas.name;
        this.messaging = new Messaging6(className);
        this.messaging.start();
    }

    // #region interface

    public onDrawGrid(listener: DrawGridListener): VoidUnsubscribe {
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

    // #region abstract

    public abstract draw(): void;

    // #endregion

    // #region events

    protected invokeDrawGrid(event: DrawGridEvent): void {
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

    // #endregion
}
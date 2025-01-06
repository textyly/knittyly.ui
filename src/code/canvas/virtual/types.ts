import { ICanvas } from "../types.js";
import { Listener, VoidListener, VoidUnsubscribe } from "../../types.js";

// #region types

export type Id = string;

export type DotsConfig = { x: number, y: number, radius: number, spacing: number };

export type Dot = { id: Id, x: number, y: number, radius: number };
export type Line = { from: Dot, to: Dot, side: CanvasSide };
export type Link = { id: Id, from: Dot, to: Dot, side: CanvasSide };

export type DrawDotEvent = { dot: Dot };
export type DrawDotListener = Listener<DrawDotEvent>;

export type DrawLineEvent = { line: Line };
export type DrawLineListener = Listener<DrawLineEvent>;

export type DrawLinkEvent = { link: Link };
export type DrawLinkListener = Listener<DrawLinkEvent>;

export type RemoveLinkEvent = { link: Link };
export type RemoveLinkListener = Listener<RemoveLinkEvent>;

export type HoverDotEvent = { dot: Dot };
export type HoverDotListener = Listener<HoverDotEvent>;

export type UnhoverDotEvent = { dot: Dot };
export type UnhoverDotListener = Listener<UnhoverDotEvent>;

// #endregion

// #region interfaces

export interface IVirtualCanvas extends ICanvas {
    onRedraw(listener: VoidListener): VoidUnsubscribe;
    onDrawDot(listener: DrawDotListener): VoidUnsubscribe;
    onDrawLine(listener: DrawLineListener): VoidUnsubscribe;
    onDrawLink(listener: DrawLinkListener): VoidUnsubscribe;
    onRemoveLink(listener: RemoveLinkListener): VoidUnsubscribe;
    onHoverDot(listener: HoverDotListener): VoidUnsubscribe;
    onUnhoverDot(listener: UnhoverDotListener): VoidUnsubscribe;

    draw(): void;
}

// #endregion

// #region enums

export enum CanvasSide {
    Front,
    Back
}


// #endregion
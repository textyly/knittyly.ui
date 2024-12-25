import { ICanvas } from "../types.js";
import { Listener, VoidListener, VoidUnsubscribe } from "../../types.js";

// #region types

export type Id = string;

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

export type DotHoveredEvent = { dot: Dot };
export type DotHoveredListener = Listener<DotHoveredEvent>;

export type DotUnhoveredEvent = { dot: Dot };
export type DotUnhoveredListener = Listener<DotUnhoveredEvent>;

// #endregion

// #region interfaces

export interface IVirtualCanvas extends ICanvas {
    onRedraw(listener: VoidListener): VoidUnsubscribe;
    onDrawDot(listener: DrawDotListener): VoidUnsubscribe;
    onDrawLine(listener: DrawLineListener): VoidUnsubscribe;
    onDrawLink(listener: DrawLinkListener): VoidUnsubscribe;
    onRemoveLink(listener: RemoveLinkListener): VoidUnsubscribe;
    onDotHovered(listener: DotHoveredListener): VoidUnsubscribe;
    onDotUnhovered(listener: DotUnhoveredListener): VoidUnsubscribe;

    draw(): void;
}

// #endregion

// #region enums

export enum CanvasSide {    
    Front,
    Back
}


// #endregion
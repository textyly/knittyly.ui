import { ICanvas } from "../types.js";
import { Position } from "../transparent/types.js";
import { Listener, VoidUnsubscribe } from "../../utilities/messaging/types.js";

// #region types
export type Id = string;
export type Dot = Position & { id: Id, radius: number };
export type Line = { from: Dot, to: Dot, type: LineType }
export type Link = Line & { id: Id };
export type LineType = MousePositionType; /// TODO: !!!

export type DrawGridEvent = { dots: Array<Dot>, lines: Array<Line> };
export type DrawGridListener = Listener<DrawGridEvent>;

export type LineEvent = { line: Line };
export type DrawLineEvent = LineEvent;
export type DrawLineListener = Listener<DrawLineEvent>;

export type LinkEvent = { link: Link };
export type DrawLinkEvent = LinkEvent;
export type DrawLinkListener = Listener<DrawLinkEvent>;

export type RemoveLinkEvent = LinkEvent;
export type RemoveLinkListener = Listener<RemoveLinkEvent>;

export type DotEvent = { dot: Dot };

export type DotHoveredEvent = DotEvent;
export type DotHoveredListener = Listener<DotHoveredEvent>;

export type DotUnhoveredEvent = DotEvent;
export type DotUnhoveredListener = Listener<DotUnhoveredEvent>;

// #endregion

// #region interfaces

export interface IVirtualCanvas extends ICanvas {
    onDrawGrid(listener: DrawGridListener): VoidUnsubscribe;
    onDrawLine(listener: DrawLineListener): VoidUnsubscribe;
    onDrawLink(listener: DrawLinkListener): VoidUnsubscribe;
    onRemoveLink(listener: RemoveLinkListener): VoidUnsubscribe;
    onDotHovered(listener: DotHoveredListener): VoidUnsubscribe;
    onDotUnhovered(listener: DotUnhoveredListener): VoidUnsubscribe;

    draw(): void;
}

// #endregion

// #region enums

// TODO: change the name
export enum MousePositionType {
    FRONT,
    BACK
}


// #endregion
import { Listener, VoidListener, VoidUnsubscribe } from "../../utilities/messaging/types";

// #region types 
export type Size = { width: number, height: number };
export type SizeChangeEvent = Size;
export type SizeChangeListener = Listener<Size>;

export type Position = { x: number, y: number };
export type PositionEvent = { position: Position };
export type MouseMoveEvent = PositionEvent;
export type MouseMoveListener = Listener<MouseMoveEvent>

export type MouseLeftButtonDownEvent = PositionEvent;
export type MouseLeftButtonDownListener = Listener<MouseLeftButtonDownEvent>;

export type ZoomInListener = VoidListener;
export type ZoomOutListener = VoidListener;

export type MouseEventHandler = (event: MouseEvent) => void
export type WheelChangeHandler = (event: WheelEvent) => void;


// #endregion

// #region interfaces

export interface IHeadlessCanvas {
    get size(): Size;
    set size(value: Size);

    initialize(): void;
    dispose(): void;

    onZoomIn(listener: ZoomInListener): VoidUnsubscribe;
    onZoomOut(listener: ZoomOutListener): VoidUnsubscribe;
    onSizeChange(listener: SizeChangeListener): VoidUnsubscribe;
    onMouseMove(listener: MouseMoveListener): VoidUnsubscribe;
    onMouseLeftButtonDown(listener: MouseLeftButtonDownListener): VoidUnsubscribe;
}

// #endregion

// #region enums

export enum CanvasEventType {
    ZoomIn = "zoom-in",
    ZoomOut = "zoom-out",
    MouseMove = "mouse-move",
    MouseLeftButtonDown = "mouse-left-button-down"
}

// #endregion

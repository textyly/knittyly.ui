import { ICanvas } from "../types.js";
import { Position } from "../transparent/types.js";
import { Listener, VoidUnsubscribe } from "../../types.js";

export type SvgDot = SVGCircleElement;
export type SvgLine = SVGLineElement;

export type HtmlCanvas = Pick<HTMLElement, "addEventListener" | "removeEventListener" | "getBoundingClientRect" | "clientWidth" | "clientHeight">

export enum HtmlCanvasEvents {
    WheelChange = "wheel",
    MouseDown = "mousedown",
    MouseMove = "mousemove",
}

export type WheelEvent = { deltaY: number };
export type WheelListener = Listener<WheelEvent>;

export type MouseMoveEvent = { position: Position };
export type MouseMoveListener = Listener<MouseMoveEvent>;

export type MouseButtonDownEvent = { position: Position } & { button: number };
export type MouseButtonDownListener = Listener<MouseButtonDownEvent>;

export interface ITransparentSvgCanvas extends ICanvas {
    onWheelChange(listener: WheelListener): VoidUnsubscribe;
    onMouseMove(listener: MouseMoveListener): VoidUnsubscribe;
    onMouseButtonDown(listener: MouseButtonDownListener): VoidUnsubscribe;
}
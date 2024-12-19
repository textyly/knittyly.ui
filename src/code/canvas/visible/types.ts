export type HtmlCanvas = Pick<HTMLElement, "addEventListener" | "removeEventListener" | "getBoundingClientRect" | "clientWidth" | "clientHeight">

export interface IVisualCanvas {
    // TODO:
}

export enum HtmlCanvasEvents {
    WheelChange = "wheel",
    MouseDown = "mousedown",
    MouseMove = "mousemove",
}



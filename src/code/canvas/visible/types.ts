export type HtmlCanvas = Pick<HTMLElement, "addEventListener" | "removeEventListener" | "getBoundingClientRect" | "clientWidth" | "clientHeight">

export enum HtmlCanvasEvents {
    WheelChange = "wheel",
    MouseDown = "mousedown",
    MouseMove = "mousemove",
}



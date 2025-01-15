import { ICanvas } from "../../types.js";
import { Dot, IDotVirtualCanvas } from "../types.js";

export interface IDotCanvas extends IDotVirtualCanvas, ICanvas {
    get dotsX(): number;
    get dotsY(): number;
    get radius(): number;
    get spacing(): number;

    draw(dotsX: number, dotsY: number, radius: number, spacing: number): void;
    getDotByCoordinates(x: number, y: number): Dot | undefined;
    getDotById(id: string): Dot | undefined;
}
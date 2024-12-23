export type Size = { width: number, height: number };

export interface ICanvas {
    get size(): Size;
    set size(value: Size);

    initialize(): void;
    dispose(): void;
}
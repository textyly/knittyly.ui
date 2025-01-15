import { Size } from "../types.js";
import { IdGenerator } from "../../utilities/generator.js";
import { Dot, DotsConfig, Id, IDotVirtualCanvas } from "./types.js";
import { VirtualCanvasBase } from "./base.js";

export class DotVirtualCanvas extends VirtualCanvasBase implements IDotVirtualCanvas {
    private readonly config: DotsConfig;
    private readonly ids: IdGenerator;

    private dots: Map<Id, Dot>;

    private dotsX: number;
    private dotsY: number;
    private radius: number;
    private spacing: number;

    constructor(config: DotsConfig) {
        super();

        this.config = config;
        this.dotsX = this.config.x;
        this.dotsY = this.config.y;
        this.radius = this.config.radius.value;
        this.spacing = this.config.spacing.value;

        this.dots = new Map();
        this.ids = new IdGenerator();
    }

    public invokeZoomIn(): void {
        this.radius += this.config.radius.step;
        this.spacing += this.config.spacing.step;
        this.draw();
    }

    public invokeZoomOut(): void {
        this.radius -= this.config.radius.step;
        this.spacing -= this.config.spacing.step;
        this.draw();
    }

    public draw(): void {
        this.dots = this.createDots();
        const newSize = this.calculateSize();
        this.size = newSize;
        this.dots.forEach((dot) => super.invokeDrawDot({ dot }));
    }

    // TODO: try to find a better algorithm
    public getDotByCoordinates(x: number, y: number): Dot | undefined {
        for (const dotKvp of this.dots) {
            const dot = dotKvp[1];
            const distance = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
            let isInside = distance <= dot.radius;
            if (isInside) {
                return dot;
            }
        }
    }

    public getDotById(id: string): Dot | undefined {
        return this.dots.get(id);
    }

    private createDots(): Map<Id, Dot> {
        this.ids.reset();
        const dots = new Map<Id, Dot>();

        for (let y = 0; y < this.dotsY; ++y) {
            for (let x = 0; x < this.dotsX; ++x) {
                const id = this.ids.next();

                // TODO: !!!
                const x1 = (x * this.spacing) + this.spacing;
                const y1 = (y * this.spacing) + this.spacing;
                const dot = { id, x: x1, y: y1, radius: this.radius };
                dots.set(id, dot);
            }
        }

        return dots;
    }

    private calculateSize(): Size {
        const width = this.spacing + (this.dotsX * this.radius) + ((this.dotsX - 1) * this.spacing);
        const height = this.spacing + (this.dotsY * this.radius) + ((this.dotsY - 1) * this.spacing);
        const size = { width, height };
        return size;
    }
}
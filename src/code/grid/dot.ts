import { Dot, DotsConfig, Id } from "../canvas/virtual/types.js";
import { IdGenerator } from "../utilities/generator.js";

export class DotGrid {
    public dots: Map<Id, Dot>;
    private readonly idGenerator: IdGenerator;

    public x!: number;
    public y!: number;
    public radius!: number;
    public spacing!: number;

    constructor(public config: DotsConfig) {
        this.dots = new Map();
        this.idGenerator = new IdGenerator();
        this.recalculate(config.x, config.y, config.radius.value, config.spacing.value);
    }

    public get width(): number {
        const w = (this.x * this.radius) + ((this.x - 1) * this.spacing);
        return w;
    }

    public get height(): number {
        const h = (this.y * this.radius) + ((this.y - 1) * this.spacing);
        return h;
    }

    public recalculate(x: number, y: number, radius: number, spacing: number): void {
        this.idGenerator.reset();
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.spacing = spacing;
        this.dots = this.createDots();
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

    private createDots(): Map<string, Dot> {
        const dots = new Map<string, Dot>();

        for (let y = 0; y < this.y; ++y) {
            for (let x = 0; x < this.x; ++x) {
                const id = this.idGenerator.next();

                // TODO: !!!
                const x1 = (x * this.spacing) + this.spacing;
                const y1 = (y * this.spacing) + this.spacing;
                const dot = { id, x: x1, y: y1, radius: this.radius };
                dots.set(id, dot);
            }
        }

        return dots;
    }
}
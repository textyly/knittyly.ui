import { Dot, Id } from "../canvas/virtual/types";
import { IdGenerator } from "../utilities/generator";

export class DotGrid {
    private readonly dots: Map<Id, Dot>;
    private readonly idGenerator: IdGenerator;

    private width!: number;
    private height!: number;
    private radius!: number;
    private spacing!: number;

    constructor(settings: DotGridSettings) {
        this.dots = new Map();
        this.idGenerator = new IdGenerator();
        this.recalculate(settings);
    }

    public get widthXXX(): number {
        throw new Error();
    }

    public get heightXXX(): number {
        throw new Error();
    }

    public get dotsXXX(): Array<Dot> {
        throw new Error();
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

    public recalculate(settings: DotGridSettings): void {
        this.width = settings.width;
        this.height = settings.height;
        this.radius = settings.radius;
        this.spacing = settings.spacing;
        this.createDots();
    }

    public recalculateBySpacing(spacing: number, radius: number): void {
        this.spacing = spacing;
        this.radius = radius;
        this.createDots();
    }

    public recalculateBySize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.createDots();
    }

    private createDots(): Map<string, Dot> {
        const dots = new Map<string, Dot>();

        for (let y = this.spacing; y < this.height; y += this.spacing) {
            for (let x = this.spacing; x < this.width; x += this.spacing) {
                const id = this.idGenerator.next();
                const dot = { id, x, y, radius: this.radius };
                dots.set(id, dot);
            }
        }

        return dots;
    }
}

export type DotGridSettings = { width: number, height: number, spacing: number, radius: number };
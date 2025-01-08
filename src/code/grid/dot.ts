import { Canvas } from "../canvas/base.js";
import { SizeChangeEvent, SizeChangeListener } from "../canvas/transparent/types.js";
import { ICanvas, Size } from "../canvas/types.js";
import { Dot, DotsConfig, DrawDotEvent, DrawDotListener, Id } from "../canvas/virtual/types.js";
import { Messaging1, Messaging2 } from "../messaging/impl.js";
import { IMessaging1, IMessaging2 } from "../messaging/types.js";
import { VoidUnsubscribe } from "../types.js";
import { IdGenerator } from "../utilities/generator.js";

interface IVirtualDotGrid {
    get size(): Size;
    get dotsX(): number;
    get dotsY(): number;
    get radius(): number;
    get spacing(): number;

    onSizeChange(listener: SizeChangeListener): VoidUnsubscribe;
    onDrawDot(listener: DrawDotListener): VoidUnsubscribe;

    draw(dotsX: number, dotsY: number, radius: number, spacing: number): void;
    getDotByCoordinates(x: number, y: number): Dot | undefined;
    getDotById(id: string): Dot | undefined;
}

export class DotGrid implements IVirtualDotGrid {
    private readonly ids: IdGenerator;
    private readonly messaging: IMessaging2<SizeChangeEvent, DrawDotEvent>;

    private dots: Map<Id, Dot>;

    private x!: number;
    private y!: number;
    private r!: number;
    private s!: number;

    constructor() {
        this.dots = new Map();
        this.ids = new IdGenerator();
        this.messaging = new Messaging2(DotGrid.name);
        this.messaging.start();
    }

    public get dotsX(): number {
        return this.x;
    }

    public get dotsY(): number {
        return this.y;
    }

    public get radius(): number {
        return this.r;
    }

    public get spacing(): number {
        return this.s;
    }

    public get size(): Size {
        const width = this.spacing + (this.x * this.radius) + ((this.x - 1) * this.spacing);
        const height = this.spacing + (this.y * this.radius) + ((this.y - 1) * this.spacing);
        const size = { width, height };
        return size;
    }

    public onSizeChange(listener: SizeChangeListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel1(listener);
    }

    public onDrawDot(listener: DrawDotListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel2(listener);
    }

    public draw(dotsX: number, dotsY: number, radius: number, spacing: number): void {
        this.x = dotsX;
        this.y = dotsY;
        this.r = radius;
        this.s = spacing;

        this.dots = this.createDots();
        this.invokeSizeChange();
        this.dots.forEach((dot) => this.invokeDrawDot(dot));
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

        for (let y = 0; y < this.y; ++y) {
            for (let x = 0; x < this.x; ++x) {
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

    private invokeSizeChange(): void {
        this.messaging.sendToChannel1(this.size);
    }

    private invokeDrawDot(dot: Dot): void {
        const event = { dot };
        this.messaging.sendToChannel2(event);
    }
}
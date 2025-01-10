import { ICanvas, Size } from "../types.js";
import { VoidUnsubscribe } from "../../types.js";
import { Messaging1 } from "../../messaging/impl.js";
import { IMessaging1 } from "../../messaging/types.js";
import { IdGenerator } from "../../utilities/generator.js";
import { Dot, DrawDotEvent, DrawDotListener, Id } from "./types.js";
import { SizeChangeEvent, SizeChangeListener } from "../input/types.js";
import { CanvasBase } from "../base.js";


interface IDotVirtualCanvas extends ICanvas {
    get size(): Size;
    get dotsX(): number;
    get dotsY(): number;
    get radius(): number;
    get spacing(): number;

    onDrawDot(listener: DrawDotListener): VoidUnsubscribe;

    draw(dotsX: number, dotsY: number, radius: number, spacing: number): void;
    getDotByCoordinates(x: number, y: number): Dot | undefined;
    getDotById(id: string): Dot | undefined;
}

export class DotVirtualCanvas extends CanvasBase implements IDotVirtualCanvas {
    private readonly ids: IdGenerator;
    private readonly messaging: IMessaging1<DrawDotEvent>;

    private dots: Map<Id, Dot>;

    private x!: number;
    private y!: number;
    private r!: number;
    private s!: number;

    constructor() {
        super();

        this.dots = new Map();
        this.ids = new IdGenerator();
        this.messaging = new Messaging1(DotVirtualCanvas.name);
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

    public onDrawDot(listener: DrawDotListener): VoidUnsubscribe {
        return this.messaging.listenOnChannel1(listener);
    }

    public draw(dotsX: number, dotsY: number, radius: number, spacing: number): void {
        this.x = dotsX;
        this.y = dotsY;
        this.r = radius;
        this.s = spacing;

        this.dots = this.createDots();
        const newSize = this.calculateSize();
        this.size = newSize;
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

    protected override initializeCore(): void {

    }

    protected override sizeChangeCore(): void {

    }

    protected override disposeCore(): void {

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

    private calculateSize(): Size {
        const width = this.spacing + (this.x * this.radius) + ((this.x - 1) * this.spacing);
        const height = this.spacing + (this.y * this.radius) + ((this.y - 1) * this.spacing);
        const size = { width, height };
        return size;
    }

    private invokeDrawDot(dot: Dot): void {
        const event = { dot };
        this.messaging.sendToChannel1(event);
    }
}
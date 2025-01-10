export class IdGenerator {
    private readonly initialId: number;

    private nextId: number;

    constructor() {
        this.initialId = -1;
        this.nextId = this.initialId;
    }

    public next(): string {
        const id = ++this.nextId;
        const strId = id.toString();
        return strId;
    }

    public reset(): void {
        this.nextId = this.initialId;
    }
}
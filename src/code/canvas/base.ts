import { Messaging1 } from "../utilities/messaging/impl";
import { IMessaging1, VoidUnsubscribe } from "../utilities/messaging/types";
import { SizeValidator } from "../utilities/validators/canvas/size";
import { SizeChangeEvent, SizeChangeListener } from "./transparent/types";
import { ICanvas, Size } from "./types";

export abstract class Canvas implements ICanvas {
    // #region fields

    private initialized: boolean;

    private readonly sizeValidator: SizeValidator;
    private readonly msg: IMessaging1<SizeChangeEvent>;
    private readonly unFuncs: Array<VoidUnsubscribe>;

    //#endregion

    constructor(private width: number, private height: number) {
        this.initialized = false;

        this.sizeValidator = new SizeValidator();
        this.sizeValidator.validateWidthAndHeight(width, height);

        const className = Canvas.name;
        this.msg = new Messaging1(className);
        this.msg.start();

        this.unFuncs = new Array<VoidUnsubscribe>;
    }

    // #region interface

    public get size(): Size {
        return { width: this.width, height: this.height };
    }

    public set size(value: Size) {
        this.sizeValidator.validateSize(value);
        this.width = value.width;
        this.height = value.height;
        this.invokeSizeChange(value);
    }

    public initialize(): void {
        if (!this.initialized) {
            this.initializeCore();
            this.initialized = true;
        }
    }

    public dispose(): void {
        if (this.initialized) {
            this.disposeCore();
            this.unFuncs.forEach((un) => un());
            this.msg.stop();
            this.initialized = false;
        }
    }

    // #region interface

    // #region abstract

    protected abstract initializeCore(): void;
    protected abstract disposeCore(): void;

    // #endregion

    // #region events

    public onSizeChange(listener: SizeChangeListener): VoidUnsubscribe {
        return this.msg.listenOnChannel1(listener);
    }

    private invokeSizeChange(event: SizeChangeEvent): void {
        this.msg.sendToChannel1(event);
    }

    // #endregion

    // #region methods

    protected registerUn(func: VoidUnsubscribe): void {
        this.unFuncs.push(func);
    }

    // #endregion 

}
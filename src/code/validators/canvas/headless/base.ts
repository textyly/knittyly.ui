import { Size } from "../../../canvas/types.js";
import { ClassValidator } from "../../class.js";
import { SizeValidator } from "../size.js";

export class HeadlessCanvasBaseValidator extends ClassValidator {
    private sizeValidator: SizeValidator;

    constructor(className: string) {
        super(className);
        this.sizeValidator = new SizeValidator();
    }

    public validateSize(size: Size): void {
        this.sizeValidator.validateSize(size);
    }
}
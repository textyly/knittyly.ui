import { Size } from "../../../canvas/headless/types.js";
import { Validator } from "../validator.js";

export class SizeValidator extends Validator {
    public validateSize(size: Size): void {
        this.validateRef(size, "size");
        this.validatePosNum(size.width, "width");
        this.validatePosNum(size.height, "height");
    }
}
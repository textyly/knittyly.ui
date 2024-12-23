import { Size } from "../../../canvas/types.js";
import { Validator } from "../validator.js";

export class SizeValidator extends Validator {
    public validateWidthAndHeight(width: number, height: number) {
        this.validatePosNum(width, "width");
        this.validatePosNum(height, "height");
    }

    public validateSize(size: Size): void {
        this.validateRef(size, "size");
        this.validateWidthAndHeight(size.width, size.height);
    }
}
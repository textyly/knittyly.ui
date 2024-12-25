import { Size } from "../../canvas/types.js";
import { Validator } from "../validator.js";

export class SizeValidator extends Validator {
    public validateSize(size: Size): void {
        super.validateRef(size, "size");
        super.validatePosNum(size.width, "width");
        super.validatePosNum(size.height, "height");
    }
}
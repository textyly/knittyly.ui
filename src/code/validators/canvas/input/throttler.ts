import { Position } from "../../../canvas/input/types.js";
import { ClassValidator } from "../../class.js";

export class InputCanvasThrottlerValidator extends ClassValidator {
    constructor(className: string) {
        super(className);
    }

    public validatePosition(position: Position): void {
        super.validateRef(position, "position");
        super.validateRef(position.x, "x");
        super.validateRef(position.y, "y");
    }
}
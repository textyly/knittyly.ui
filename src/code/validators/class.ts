import { Validator } from "./validator.js";

export class ClassValidator extends Validator {
    constructor(public className: string) {
        super();
        super.validateStr(className, "className");
    }
}
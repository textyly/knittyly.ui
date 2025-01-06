import { ValidatorBase } from "./base.js";

export class Validator extends ValidatorBase {
    public validateRef(value: any, propName: string): void {
        if (value === undefined) {
            throw new Error(`${propName} cannot be undefined.`);
        }
        if (value === null) {
            throw new Error(`${propName} cannot be null.`);
        }
        if (propName === undefined) {
            throw new Error(`property name cannot be undefined.`);
        }
        if (propName === null) {
            throw new Error(`property name cannot be  cannot be null.`);
        }
    }

    public validateStr(value: string, propName: string): void {
        this.validateRef(value, propName);
        if (value.length < 0) {
            throw new Error(`${propName} must be none empty string.`);
        }
    }

    public validatePosNum(value: number, propName: string): void {
        this.validateRef(value, propName);
        if (value < 0) {
            throw new Error(`${propName} must be positive number bigger than 0.`);
        }
    }
}
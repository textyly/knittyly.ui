import { IValidator } from "./types.js";

export abstract class ValidatorBase implements IValidator {
    abstract validateRef(value: any, propName: string): void;
    abstract validateStr(value: string, propName: string): void;
    abstract validatePosNum(value: number, propName: string): void;

    public isValidRef(value: any, propName: string): boolean {
        try {
            this.validateRef(value, propName);
            return true;
        } catch {
            return false;
        }
    }

    public isValidStr(value: string, propName: string): boolean {
        try {
            this.validateStr(value, propName);
            return true;
        } catch {
            return false;
        }
    }

    public isValidPosNum(value: number, propName: string): boolean {
        try {
            this.validatePosNum(value, propName);
            return true;
        } catch {
            return false;
        }
    }
}
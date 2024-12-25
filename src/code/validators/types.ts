// #region types
// #endregion

// #region interfaces

/**
 * 
 */
export interface IValidator {
    /**
     * 
     * @param value 
     * @param propName 
     */
    isValidRef(value: any, propName: string): boolean;

    /**
     * 
     * @param value 
     * @param propName 
     */
    isValidStr(value: string, propName: string): boolean;

    /**
     * 
     * @param value 
     * @param propName 
     */
    isValidPosNum(value: number, propName: string): boolean;

    /**
     * 
     * @param value 
     * @param propName 
     */
    validateRef(value: any, propName: string): void;

    /**
     * 
     * @param value 
     * @param propName 
     */
    validateStr(value: string, propName: string): void;

    /**
     * 
     * @param value 
     * @param propName 
     */
    validatePosNum(value: number, propName: string): void;
}

// #endregion

// #region enums
// #endregion
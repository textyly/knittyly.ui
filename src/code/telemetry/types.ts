import { ErrorListener, VoidUnsubscribe } from "../types";

export interface ITelemetryEmitter {
    /**
    * 
    * @param listener 
    */
    onError(listener: ErrorListener): VoidUnsubscribe;

    // TODO: add more telemetry methods such as slow listener, etc.
}
import debugMod from "debug";

/**
 * Wrapper for debug.
 * It allows to show additional information id debug mode.
 */
export class DebugLogger {
    private readonly debugger: any;

    /**
     * @param name
     */
    constructor(name: string) {
        this.debugger = debugMod(name);
    }

    /**
     * Show all variables.
     *
     * @param args
     */
    public log(...args) {
        this.debugger.apply(this.debugger, args);
    }

    /**
     * Show structures split by headers.
     *
     * @param args
     */
    public logWithTitles(...args) {
        args.map((arg) => {
            for (const key of arg) {
                this.log(key);
                this.log(arg[key]);
            }
        });
    }
}

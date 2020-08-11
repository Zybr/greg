import debug = require("debug");
import util = require("util");

/**
 * Create debugger.
 *
 * @param namespace
 */
export function createDebugger(namespace: string) {
    const debugFunc = debug(namespace);

    return (...args) => {
        debugFunc.apply(debugFunc, args
            .map((arg) => {
                return util.inspect(arg, null, 10, true);
            }),
        );
    };
}

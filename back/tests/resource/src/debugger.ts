import debug = require("debug");
import util = require("util");

/**
 * Get debug function.
 *
 * @param name
 */
export function getDebugger(name: string) {
    const debugFunc = debug(name);

    return (...args) => {
        debugFunc.apply(debugFunc, args
            .map((arg) => {
                return util.inspect(arg, null, 10, true);
            }),
        );
    };
}

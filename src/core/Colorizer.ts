import {blue, red, yellow} from "colors/safe";

/**
 * Change output color of console text.
 *
 * Example:
 *      console.error('error'); // Red
 *      console.info('info'); // Blue
 *      console.warn('warn'); // Yellow
 */
export class Colorizer {

    /**
     * Override default methods.
     */
    public static color() {
        /**
         * Override default methods.
         */
        for (const config of Colorizer.colorConfig) {
            const methodName = config.consoleMethodName;
            const srcMethod = console[methodName];

            console[methodName] = function log() {
                const args = [].map.call( // Replace arguments
                    arguments,
                    (arg) => config.colorMethod(arg || ""),
                );
                srcMethod.apply(console, args); // Call source method
            };
        }
    }

    /**
     * Config.
     * Map method-color.
     *
     * @type {{}[]}
     */
    private static readonly colorConfig = [
        {
            colorMethod: red,
            consoleMethodName: "error",
        },
        {
            colorMethod: blue,
            consoleMethodName: "info",
        },
        {
            colorMethod: yellow,
            consoleMethodName: "warn",
        },
    ];
}

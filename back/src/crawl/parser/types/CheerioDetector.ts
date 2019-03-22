/**
 * Define Cheerio type.
 *
 * @param arg
 */
export function isCheerio(arg: any): arg is Cheerio {
    return arg && arg.html && typeof arg.html === "function";
}

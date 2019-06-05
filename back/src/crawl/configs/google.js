// This config is not correct.
module.exports = {
    request  : {
        url: "https://www.google.com/search",
    },
    selectors: {
        items  : {
            properties: {
                title  : "div > a > div | text",
                url    : "div > a | attr:href",
                snippet: "div > a > div | text",
            },
            query     : "body > div > div | []"
        },
        // nextUrl: "footer a | []:1 | attr:href",
        nextUrl: "footer div | []:1 | attr:href", // Invalid path.
    }
};

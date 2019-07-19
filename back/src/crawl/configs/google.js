module.exports = {
    request  : {
        url       : "https://www.google.com/search",
        method    : "GET",
        parameters: {},
    },
    selectors: {
        items  : {
            properties: {
                title  : "//*/a/div/text() | shift",
                url    : "//*/a/@href | shift | toString | match : /(http[^\"]+)/i | shift",
                snippet: "//div/text() | slice : 2 : 3 | shift",
            },
            query     : "//*[@id='main']/div[@class]/div",
        },
        nextUrl: "//footer//a[1]/@href | shift | toString | replace : /(^ href=\")|(\"$)/g : ''",
    }
};

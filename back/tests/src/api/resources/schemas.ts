// Responses

export const errorSchema = {
    properties: {
        data: { // Stack trace
            items: {
                type: "string",
            },
            minItems: 1,
            type: "array",
        },
        message: {type: "string"},
    },
    required: ["data", "message"],
};

// Models

export const mapSchema = {
    properties: {
        id: {type: "string"},
        name: {type: "string"},
        structure: {type: "string"},
    },
    required: ["id", "name", "structure"],
    title: "Map",
    type: "object",
};

export const mapListSchema = {
    properties: {
        data: {
            items: mapSchema,
            minItems: 1,
            type: "array",
            unique: true,
        },
    },
    required: ["data"],
    title: "Map list",
    type: "object",
};

export const resourceSchema = {
    properties: {
        id: {type: "string"},
        map: {
            anyOf: [
                mapSchema,
                {
                    type: "null",
                },
            ],
        },
        name: {type: "string"},
        url: {type: "string"},
    },
    required: ["id", "map", "name", "url"],
    title: "Resource",
    type: "object",
};

export const resourceListSchema = {
    properties: {
        data: {
            items: resourceSchema,
            minItems: 1,
            type: "array",
            unique: true,
        },
    },
    required: ["data"],
    title: "Resource list",
    type: "object",
};

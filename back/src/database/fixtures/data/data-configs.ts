import Map from "../../models/Map";
import Resource from "../../models/Resource";

export default [
    {
        filePath: "./data/maps",
        model: Map,
        showFields: ["name"],
    },
    {
        filePath: "./data/resources",
        model: Resource,
        showFields: ["name", "url"],
    },
];

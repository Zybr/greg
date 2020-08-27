import Map from "../../models/Map";
import Resource from "../../models/Resource";

export default [
    {
        filePath: "./data/maps",
        model: Map,
        reportedProps: ["name"],
    },
    {
        filePath: "./data/resources",
        model: Resource,
        reportedProps: ["name", "url"],
    },
];

import listEndpoints = require("express-list-endpoints");
import { app } from "../../app";
import { Colorizer } from "../core/Colorizer";

Colorizer.color();

listEndpoints(app).forEach((route) => {
    route.methods.forEach((method) => {
        console.info(method, route.path);
    });
});

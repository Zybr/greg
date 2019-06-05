import listEndpoints = require("express-list-endpoints");
import {app} from "../../app";

listEndpoints(app).forEach((route) => {
    route.methods.forEach((method) => {
        console.log(method, route.path);
    });
});

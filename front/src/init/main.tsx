import Container from "@material-ui/core/Container";
import React from "react";
import ReactDOM from "react-dom";
import ResourceLocatorService from "../services/api/ResourceLocatorService";
import ResourceService from "../services/api/ResourceService";

const resourceSrv = new ResourceService(new ResourceLocatorService());
resourceSrv.getList()
    .then((resources) => console.log(resources));

document.addEventListener("DOMContentLoaded", () => {
    ReactDOM.render(
        <Container>
            <p>Crawling</p>
        </Container>,
        document.getElementById("content"),
    );
});

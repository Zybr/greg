import Container from "@material-ui/core/Container";
import React from "react";
import ReactDOM from "react-dom";
import Search from "../components/search/Search";

document.addEventListener("DOMContentLoaded", () => {
    ReactDOM.render(
        <Container>
            <Search/>
        </Container>,
        document.getElementById("search"),
    );
});

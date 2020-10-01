import React from 'react';
import './App.scss';
import { Container } from '@material-ui/core';
import ResourcesContainer from "../ResourcesContainer/ResourcesContainer";

function App() {
    return (
        <div className="App" data-testid="App">
            <Container>
                <ResourcesContainer/>
            </Container>
        </div>
    );
}

export default App;

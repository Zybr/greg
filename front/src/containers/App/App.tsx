import React from 'react';
import './App.scss';
import ResourcesSection from "../ResourcesSection/ResourcesSection.lazy";
import { Container } from '@material-ui/core';

function App() {
    return (
        <div className="App" data-testid="App">
            <Container>
                <ResourcesSection/>
            </Container>
        </div>
    );
}

export default App;

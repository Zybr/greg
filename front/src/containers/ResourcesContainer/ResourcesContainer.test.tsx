import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom/extend-expect';
import ResourcesContainer from './ResourcesContainer';
import store from "../../store";

describe('<ResourcesContainer />', () => {
    test('it should mount', () => {
        render(
            <Provider store={store}>
                <ResourcesContainer/>
            </Provider>
        );

        const resourcesContainer = screen.getByTestId('ResourcesContainer');

        expect(resourcesContainer).toBeInTheDocument();
    });
});

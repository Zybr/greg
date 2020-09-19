import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom/extend-expect';
import ResourcesSection from './ResourcesSection';
import store from "../../store";

describe('<ResourcesContainer />', () => {
    test('it should mount', () => {
        render(
            <Provider store={store}>
                <ResourcesSection/>
            </Provider>
        );

        const resourcesSection = screen.getByTestId('ResourcesSection');

        expect(resourcesSection).toBeInTheDocument();
    });
});

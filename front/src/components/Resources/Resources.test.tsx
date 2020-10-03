import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import store from "../../store";
import Resources from "./Resources";

describe('<Resources/>', () => {
    test('it should mount', () => {
        render(
            <Provider store={store}>
                <Resources/>
            </Provider>
        );

        expect(screen.getByTestId('Resources')).toBeInTheDocument();
    });
});

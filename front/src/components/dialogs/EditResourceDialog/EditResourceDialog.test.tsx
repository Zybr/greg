import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditResourceDialog from './EditResourceDialog';

describe('<EditResourceDialog />', () => {
    test('it should mount', () => {
        render(<EditResourceDialog isOpen={true}/>);

        const editResource = screen.getByTestId('EditResourceDialog');

        expect(editResource).toBeInTheDocument();
    });
});

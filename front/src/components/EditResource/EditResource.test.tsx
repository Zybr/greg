import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditResource from './EditResource';

describe('<EditResource />', () => {
  test('it should mount', () => {
    render(<EditResource onApply={() => {}}/>);
    
    const editResource = screen.getByTestId('EditResource');

    expect(editResource).toBeInTheDocument();
  });
});

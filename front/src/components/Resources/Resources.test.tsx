import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Resources from './Resources';
import faker from "faker";
import { Resource } from "../../models/Resource";

const models = [{
    id: 1,
    name: faker.lorem.word(),
}] as unknown as Resource[];


describe('<Resources />', () => {
    test('it should mount', () => {
        render(<Resources resources={models}/>);

        const resources = screen.getByTestId('Resources');

        expect(resources).toBeInTheDocument();
    });
});

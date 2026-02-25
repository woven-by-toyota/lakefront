import React from 'react';
import { renderWithTheme as render } from 'src/lib/testing';
import RadioGroup from '../RadioGroup';

const name = 'Alphabet';
const options = [
    {label: 'A', value: 'A'},
    {label: 'B', value: 'B'},
    {label: 'C', value: 'C'}
];

describe('RadioGroup', () => {
    describe('general rendering', () => {
        it('renders the radio buttons', () => {
            const { container } = render(
                <RadioGroup name={name} options={options} />
            );

            const radioButtons = container.querySelectorAll('input');

            expect(radioButtons).toHaveLength(3);
        });

        it('should render the buttons disabled when disabled is true', () => {
            const { container } = render(
                <RadioGroup name={name} options={options} disabled={true} />
            );

            const radioButtons = container.querySelectorAll('input');

            expect(radioButtons[0]).toHaveAttribute('disabled');
            expect(radioButtons[1]).toHaveAttribute('disabled');
            expect(radioButtons[2]).toHaveAttribute('disabled');
        });

        it('should disable a single button disabled when disabled is true for that option', () => {
            const { container } = render(
              <RadioGroup
                name={name}
                options={[...options, { label: 'D', value: 'D', disabled: true }]}
              />
            );

            const radioButtons = container.querySelectorAll('input');

            expect(radioButtons[0]).not.toHaveAttribute('disabled');
            expect(radioButtons[1]).not.toHaveAttribute('disabled');
            expect(radioButtons[2]).not.toHaveAttribute('disabled');
            expect(radioButtons[3]).toHaveAttribute('disabled');
        });
    });
});

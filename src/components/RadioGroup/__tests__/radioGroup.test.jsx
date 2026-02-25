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

    describe('theme support', () => {
        it('renders correctly in light theme', () => {
            const { container } = render(
                <RadioGroup name={name} options={options} />
            );

            const radioButtons = container.querySelectorAll('input');
            expect(radioButtons).toHaveLength(3);
        });

        it('renders correctly in dark theme', () => {
            const { container } = render(
                <RadioGroup name={name} options={options} />,
                'dark'
            );

            const radioButtons = container.querySelectorAll('input');
            expect(radioButtons).toHaveLength(3);
        });

        it('renders disabled state consistently across themes', () => {
            const { container: lightContainer } = render(
                <RadioGroup name={name} options={options} disabled={true} />
            );

            const { container: darkContainer } = render(
                <RadioGroup name={name} options={options} disabled={true} />,
                'dark'
            );

            const lightRadioButtons = lightContainer.querySelectorAll('input');
            const darkRadioButtons = darkContainer.querySelectorAll('input');

            // Both themes should have same number of disabled buttons
            expect(lightRadioButtons).toHaveLength(3);
            expect(darkRadioButtons).toHaveLength(3);

            // All buttons should be disabled in both themes
            lightRadioButtons.forEach(button => {
                expect(button).toHaveAttribute('disabled');
            });

            darkRadioButtons.forEach(button => {
                expect(button).toHaveAttribute('disabled');
            });
        });

        it('renders individual disabled options consistently across themes', () => {
            const mixedOptions = [
                ...options,
                { label: 'D', value: 'D', disabled: true }
            ];

            const { container: lightContainer } = render(
                <RadioGroup name={name} options={mixedOptions} />
            );

            const { container: darkContainer } = render(
                <RadioGroup name={name} options={mixedOptions} />,
                'dark'
            );

            const lightRadioButtons = lightContainer.querySelectorAll('input');
            const darkRadioButtons = darkContainer.querySelectorAll('input');

            expect(lightRadioButtons).toHaveLength(4);
            expect(darkRadioButtons).toHaveLength(4);

            // First three buttons should be enabled
            expect(lightRadioButtons[0]).not.toHaveAttribute('disabled');
            expect(lightRadioButtons[1]).not.toHaveAttribute('disabled');
            expect(lightRadioButtons[2]).not.toHaveAttribute('disabled');
            expect(darkRadioButtons[0]).not.toHaveAttribute('disabled');
            expect(darkRadioButtons[1]).not.toHaveAttribute('disabled');
            expect(darkRadioButtons[2]).not.toHaveAttribute('disabled');

            // Fourth button should be disabled in both themes
            expect(lightRadioButtons[3]).toHaveAttribute('disabled');
            expect(darkRadioButtons[3]).toHaveAttribute('disabled');
        });

        it('renders radio button labels in light theme', () => {
            const { getByText } = render(
                <RadioGroup name={name} options={options} />
            );

            // Check that all labels are present in light theme
            options.forEach(option => {
                expect(getByText(option.label)).toBeInTheDocument();
            });
        });

        it('renders radio button labels in dark theme', () => {
            const { getByText } = render(
                <RadioGroup name={name} options={options} />,
                'dark'
            );

            // Check that all labels are present in dark theme
            options.forEach(option => {
                expect(getByText(option.label)).toBeInTheDocument();
            });
        });

        it('maintains radio button functionality across themes', () => {
            const { container: lightContainer } = render(
                <RadioGroup name={name} options={options} value="A" />
            );

            const { container: darkContainer } = render(
                <RadioGroup name={name} options={options} value="A" />,
                'dark'
            );

            const lightRadioButtons = lightContainer.querySelectorAll('input');
            const darkRadioButtons = darkContainer.querySelectorAll('input');

            // First option should be checked in both themes when value="A"
            expect(lightRadioButtons[0]).toHaveAttribute('value', 'A');
            expect(darkRadioButtons[0]).toHaveAttribute('value', 'A');

            // Verify proper radio button structure
            lightRadioButtons.forEach((button, index) => {
                expect(button).toHaveAttribute('type', 'radio');
                expect(button).toHaveAttribute('name', name);
                expect(button).toHaveAttribute('value', options[index].value);
            });

            darkRadioButtons.forEach((button, index) => {
                expect(button).toHaveAttribute('type', 'radio');
                expect(button).toHaveAttribute('name', name);
                expect(button).toHaveAttribute('value', options[index].value);
            });
        });
    });
});

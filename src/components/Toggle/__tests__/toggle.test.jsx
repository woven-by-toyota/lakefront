import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import Toggle from '../Toggle';

const toggleOptions = [
    {
        label: 'First',
        value: 'first'
    },
    {
        label: 'Second',
        value: 'second'
    }
];

describe('Toggle', () => {
    let onChange;

    beforeEach(() => {
        onChange = jest.fn();
    });

    it('renders first option when value set to first option value', () => {
        const { container, getByText } = render(
            <Toggle
                options={toggleOptions}
                value={toggleOptions[0].value}
                onChange={onChange}
            />
        );

        const [icon] = container.querySelectorAll('div span:nth-of-type(2)');

        expect(getByText(toggleOptions[0].label)).toBeInTheDocument();
        expect(icon).toHaveStyle('left: 0px');
    });

    it('renders second option when value set to second option value', () => {
        const { container, getByText } = render(
            <Toggle
                options={toggleOptions}
                value={toggleOptions[1].value}
                onChange={onChange}
            />
        );

        const [icon] = container.querySelectorAll('div span:nth-of-type(2)');

        expect(getByText(toggleOptions[1].label)).toBeInTheDocument();
        expect(icon).toHaveStyle('left: 16px');
    });

    it('calls onChange properly on clicking label and switch wrapper', () => {
        const { container, getByText } = render(
            <Toggle
                options={toggleOptions}
                value={toggleOptions[0].value}
                onChange={onChange}
            />
        );

        expect(getByText(toggleOptions[0].label)).toBeInTheDocument();

        const label = getByText(toggleOptions[0].label);
        const [wrapper] = container.querySelectorAll('div');

        fireEvent.click(label);

        expect(onChange).toHaveBeenCalledWith(toggleOptions[1].value);

        fireEvent.click(wrapper);

        // We aren't changing the value, so this won't actually toggle in the test
        expect(onChange).toHaveBeenCalledWith(toggleOptions[1].value);
    });

    it('does not call onChange when clicking label and switch wrapper when disabled', () => {
        const { container, getByText } = render(
            <Toggle
                options={toggleOptions}
                value={toggleOptions[0].value}
                onChange={onChange}
                disabled={true}
            />
        );

        expect(getByText(toggleOptions[0].label)).toBeInTheDocument();

        const label = getByText(toggleOptions[0].label);
        const [wrapper] = container.querySelectorAll('div');

        fireEvent.click(label);

        expect(onChange).not.toHaveBeenCalled();

        fireEvent.click(wrapper);

        expect(onChange).not.toHaveBeenCalled();
    });

    describe('theme support', () => {
        it('renders correctly in light theme', () => {
            const { container, getByText } = render(
                <Toggle
                    options={toggleOptions}
                    value={toggleOptions[0].value}
                    onChange={onChange}
                />
            );

            const [icon] = container.querySelectorAll('div span:nth-of-type(2)');

            expect(getByText(toggleOptions[0].label)).toBeInTheDocument();
            expect(icon).toHaveStyle('left: 0px');
        });

        it('renders correctly in dark theme', () => {
            const { container, getByText } = render(
                <Toggle
                    options={toggleOptions}
                    value={toggleOptions[0].value}
                    onChange={onChange}
                />,
                'dark'
            );

            const [icon] = container.querySelectorAll('div span:nth-of-type(2)');

            expect(getByText(toggleOptions[0].label)).toBeInTheDocument();
            expect(icon).toHaveStyle('left: 0px');
        });

        it('handles first option state in light theme', () => {
            const { container, getByText } = render(
                <Toggle
                    options={toggleOptions}
                    value={toggleOptions[0].value}
                    onChange={onChange}
                />
            );

            const [icon] = container.querySelectorAll('div span:nth-of-type(2)');
            expect(getByText(toggleOptions[0].label)).toBeInTheDocument();
            expect(icon).toHaveStyle('left: 0px');
        });

        it('handles first option state in dark theme', () => {
            const { container, getByText } = render(
                <Toggle
                    options={toggleOptions}
                    value={toggleOptions[0].value}
                    onChange={onChange}
                />,
                'dark'
            );

            const [icon] = container.querySelectorAll('div span:nth-of-type(2)');
            expect(getByText(toggleOptions[0].label)).toBeInTheDocument();
            expect(icon).toHaveStyle('left: 0px');
        });

        it('handles second option state in light theme', () => {
            const { container, getByText } = render(
                <Toggle
                    options={toggleOptions}
                    value={toggleOptions[1].value}
                    onChange={onChange}
                />
            );

            const [icon] = container.querySelectorAll('div span:nth-of-type(2)');
            expect(getByText(toggleOptions[1].label)).toBeInTheDocument();
            expect(icon).toHaveStyle('left: 16px');
        });

        it('handles second option state in dark theme', () => {
            const { container, getByText } = render(
                <Toggle
                    options={toggleOptions}
                    value={toggleOptions[1].value}
                    onChange={onChange}
                />,
                'dark'
            );

            const [icon] = container.querySelectorAll('div span:nth-of-type(2)');
            expect(getByText(toggleOptions[1].label)).toBeInTheDocument();
            expect(icon).toHaveStyle('left: 16px');
        });

        it('handles click events in light theme', () => {
            const onChange = jest.fn();

            const { getByText } = render(
                <Toggle
                    options={toggleOptions}
                    value={toggleOptions[0].value}
                    onChange={onChange}
                />
            );

            fireEvent.click(getByText(toggleOptions[0].label));
            expect(onChange).toHaveBeenCalledWith(toggleOptions[1].value);
        });

        it('handles click events in dark theme', () => {
            const onChange = jest.fn();

            const { getByText } = render(
                <Toggle
                    options={toggleOptions}
                    value={toggleOptions[0].value}
                    onChange={onChange}
                />,
                'dark'
            );

            fireEvent.click(getByText(toggleOptions[0].label));
            expect(onChange).toHaveBeenCalledWith(toggleOptions[1].value);
        });

        it('handles disabled state in light theme', () => {
            const onChange = jest.fn();

            const { getByText } = render(
                <Toggle
                    options={toggleOptions}
                    value={toggleOptions[0].value}
                    onChange={onChange}
                    disabled={true}
                />
            );

            fireEvent.click(getByText(toggleOptions[0].label));
            expect(onChange).not.toHaveBeenCalled();
        });

        it('handles disabled state in dark theme', () => {
            const onChange = jest.fn();

            const { getByText } = render(
                <Toggle
                    options={toggleOptions}
                    value={toggleOptions[0].value}
                    onChange={onChange}
                    disabled={true}
                />,
                'dark'
            );

            fireEvent.click(getByText(toggleOptions[0].label));
            expect(onChange).not.toHaveBeenCalled();
        });
    });
});

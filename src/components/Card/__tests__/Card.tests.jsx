import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme as render } from '../../../lib/testing';
import Card from '../Card'

describe('<Card />', () => {
    it('renders CardProps', () => {
        const { container, getByText } = render(
            <Card
                title='My Card'
                description='This is a card description.'
                content={<span>Span Content</span>}
                disabled={false}
                onClick={() => undefined}
            />);

        getByText('My Card');
        getByText('This is a card description.');
        getByText('Span Content');
        expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('calls onClick when clicked and disabled is false', async () => {
        const click = jest.fn();
        const { container } = render(
            <Card
                title='My Card'
                description='This is a card description.'
                content={<span>Span Content</span>}
                disabled={false}
                onClick={click}
            />);

        const button = container.querySelector('button');
        await waitFor(() => fireEvent.click(button));

        expect(click).toHaveBeenCalled();
    });

    it('does not call onClick when disabled is true', () => {
        const click = jest.fn();
        const { container } = render(
            <Card
                title='My Card'
                description='This is a card description.'
                content={<span>Span Content</span>}
                disabled={true}
                onClick={click}
            />);

        const button = container.querySelector('button');
        fireEvent.click(button);

        expect(click).not.toHaveBeenCalled();
        expect(button).toBeDisabled();
    });

    it('renders topRightComponent to override original Button.', () => {
        const { getByText } = render(
            <Card
                title='My Card'
                description='This is a card description.'
                content={<span>Span Content</span>}
                disabled={false}
                topRightComponent={<button>Override button</button>}
                onClick={() => undefined}
            />);

        getByText('Override button');
    });
});

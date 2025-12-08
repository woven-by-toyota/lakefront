import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from '../../../lib/testing';
import Collapsible from '../Collapsible';

const TEXT_CONTENT = 'textContent';
const PROPS = {
    title: 'title',
    subtitle: 'subtitle',
    divider: true,
    children: (<div>{TEXT_CONTENT}</div>)
};

describe('Collapsible', () => {
    it('renders the title, subtitle, divider and child content properly', () => {
        const { getByText, container } = render(<Collapsible {...PROPS} />);

        getByText(PROPS.title);
        getByText(PROPS.subtitle);
        getByText(TEXT_CONTENT);
        expect(container.querySelector('div.divider')).toBeInTheDocument();
    });

    it('hides the child content by default', () => {
        const { container } = render(<Collapsible {...PROPS} />);

        expect(container.querySelector('div.collapsed')).toBeInTheDocument();
        expect(container.querySelector('div.expanded')).not.toBeInTheDocument();
    });

    it('hides the divider when divider is false', () => {
        const { container } = render(<Collapsible {...PROPS} divider={false} />);

        expect(container.querySelector('div.divider')).not.toBeInTheDocument();
    });

    it('calls the onChange action on collapse/expand click', () => {
        const handleChange = jest.fn();
        const { getByRole } = render(<Collapsible {...PROPS} onChange={handleChange} />);
        
        fireEvent.click(getByRole('button'));
        
        expect(handleChange).toHaveBeenCalled();
    });

    it('hides the content on collapse click', () => {
        const { container, getByRole } = render(<Collapsible {...PROPS} expanded />);
        
        fireEvent.click(getByRole('button'));
        
        expect(container.querySelector('div.collapsed')).toBeInTheDocument();
        expect(container.querySelector('div.expanded')).not.toBeInTheDocument();
    });

    it('shows the content on expand click', () => {
        const { container, getByRole } = render(<Collapsible {...PROPS} />);
        
        fireEvent.click(getByRole('button'));
        
        expect(container.querySelector('div.collapsed')).not.toBeInTheDocument();
        expect(container.querySelector('div.expanded')).toBeInTheDocument();
    });

    it('does not display expand/collapse button when collapsible is false', () => {
        const { queryByRole } = render(<Collapsible {...PROPS} collapsible={false} />);
        
        expect(queryByRole('button')).not.toBeInTheDocument();
    });
});

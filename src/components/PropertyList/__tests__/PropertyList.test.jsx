import React from 'react';
import { renderWithTheme as render } from 'src/lib/testing';
import PropertyList, { PropertyListVariable } from '../PropertyList';

const attributes = [
    { caption: 'P1', content: d => d.p1 },
    { caption: 'P2', content: d => d.p2 }
]

const data = {
    p1: 'content 1',
    p2: 'content 2'
};

describe('<PropertiesPanel />', () => {
    it('renders a title and attributes', () => {
        const { container } = render(<PropertyList attributes={attributes} data={data} />);

        expect(container.querySelectorAll('span').length).toBe(4);
        expect(container.querySelectorAll('span')[0].textContent).toBe('P1');
        expect(container.querySelectorAll('span')[3].textContent).toBe('content 2');
    });
});

describe('<PropertyListLeftAligned />', () => {
    it('renders a title and attributes', () => {
        const { container } = render(<PropertyListVariable attributes={attributes} data={data} />);

        expect(container.querySelectorAll('div div').length).toBe(2);

        const firstItem = container.querySelectorAll('div div')[0];
        const lastItem = container.querySelectorAll('div div')[1];
        expect(firstItem.querySelectorAll('span')[0].textContent).toBe('P1');
        expect(lastItem.querySelectorAll('span')[1].textContent).toBe('content 2');
    });
});

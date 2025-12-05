import React from 'react';
import { renderWithTheme as render } from '../../../lib/testing';
import Header from '../Header';

describe('Header', () => {
    describe('general rendering', () => {
        it('renders the children', () => {
            const { container } = render(
                <Header><span>child component</span></Header>
            );

            const [element] = container.querySelectorAll('span');

            expect(element).toHaveTextContent('child component');
        });
        it('should not render any child component', () => {
            const { container } = render(
                <Header></Header>
            );

            const [element] = container.querySelectorAll('span');

            expect(element).toBe(undefined);
        });
        it('renders a div with header styles', () => {
            const { container } = render(
                <Header></Header>
            );
            const [element] = container.querySelectorAll('div');
            
            expect(element).toHaveStyle("margin: 0 0 12px;");
        });
    });
});

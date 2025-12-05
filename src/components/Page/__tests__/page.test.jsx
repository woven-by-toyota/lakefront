import React from 'react';
import { renderWithTheme as render } from '../../../lib/testing';
import Page from '../Page';

describe('Page', () => {
    describe('general rendering', () => {
        it('renders the children', () => {
            const { container } = render(
                <Page><span>child component</span></Page>
            );

            const [element] = container.querySelectorAll('span');

            expect(element).toHaveTextContent('child component');
        });
        it('should not render any child component', () => {
            const { container } = render(
                <Page></Page>
            );

            const [element] = container.querySelectorAll('span');

            expect(element).toBe(undefined);
        });
        it('renders a div with page styles', () => {
            const { container } = render(
                <Page></Page>
            );
            const [element] = container.querySelectorAll('div');
            
            expect(element).toHaveStyle("padding: 42px;");
            expect(element).toHaveStyle("justify-content: center;");
        });
    });
});

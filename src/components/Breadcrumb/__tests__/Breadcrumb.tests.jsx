import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { renderWithTheme } from '../../../lib/testing';
import Breadcrumb from '../Breadcrumb';

describe('<Breadcrumb />', () => {
    it('renders a single route just fine', () => {
        const routes = [
            {
                name: 'Page',
                url: '/Page'
            }
        ];

        const { container } = renderWithTheme(
            <BrowserRouter>
                <Breadcrumb routes={routes} />
            </BrowserRouter>
        );
        expect(container.querySelectorAll('nav')[0]).toHaveTextContent('Page');
    });

    it('can handle multiple routes', () => {
        const routes = [
            {
                name: 'Page',
                url: '/Page'
            },
            {
                name: 'Sub Page',
                url: '/Page/SubPage'
            }
        ];

        const { container } = renderWithTheme(
            <BrowserRouter>
                <Breadcrumb routes={routes} />
            </BrowserRouter>
        );
        expect(container.querySelectorAll('nav')[0]).toHaveTextContent('Sub Page');
    });
});

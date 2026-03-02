import React from 'react';
import { cleanup } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import ItemResult from '../ItemResults';

afterAll(cleanup);

describe('<ItemResult />', () => {
    it('renders properly', () => {
        const { container } = render(
            <ItemResult dataLength={1} totalItems={5}>
            </ItemResult>
        );

        expect(container.querySelectorAll('div')).toHaveLength(1);
    });

    it('confirms styles are present', () => {
        const { container } = render(
            <ItemResult dataLength={1} totalItems={5}>
            </ItemResult>
        );
        const firstDiv = container.firstChild;
        expect(firstDiv).toHaveStyle({ marginRight: '13px' });
        expect(firstDiv).toHaveStyle({ fontSize: '12px' });
    });

    it('confirms grid styles are present when set', () => {
        const { container } = render(
            <ItemResult dataLength={2} totalItems={5}>
            </ItemResult>
        )
        expect(container).toHaveTextContent('1 - 2 of 5')
    });
});

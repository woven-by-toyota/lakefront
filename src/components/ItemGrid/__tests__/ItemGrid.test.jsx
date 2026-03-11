import React from 'react';
import { cleanup } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import ItemGrid from '../ItemGrid';

afterAll(cleanup);

describe('<ItemGrid />', () => {
    it('renders properly', () => {
        const { container } = render(
            <ItemGrid maxColumns={5}>
                <div id="expected" />
            </ItemGrid>
        );

        expect(container.querySelectorAll('#expected')).toHaveLength(1);
    });

    it('confirms grid styles are present', () => {
        const { container } = render(
            <ItemGrid maxColumns={5} columnWidthMin={'100px'}>
                <div id="expected" />
            </ItemGrid>
        );

        const firstDiv = container.firstChild;
        const innerDiv = firstDiv.firstChild;

        expect(innerDiv).toHaveStyle({ display: 'grid' });
    });

    it('confirms grid styles are present when set', () => {
        const { debug, container } = render(
            <ItemGrid maxColumns={5} innerWidth={1000} columnWidthMin={'50px'} gridGap={{ rowGap: 17, columnGap: 12 }} >
                <div id="expected" />
            </ItemGrid>
        );

        const firstDiv = container.firstChild;
        const innerDiv = firstDiv.firstChild;
        expect(innerDiv).toHaveStyle("grid-template-columns: repeat(auto-fill, minmax(50px, -1.26vw))");
    });
});


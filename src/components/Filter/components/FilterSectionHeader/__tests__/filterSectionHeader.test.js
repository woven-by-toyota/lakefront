import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import FilterSectionHeader from '../FilterSectionHeader';
import { BASE_FILTER } from 'src/components/Filter/__tests__/filter.data';

const FILTER_SECTION_PROPS = {
    activeSection: 'a',
    filter: {
        description: 'Words to include.',
        label: 'Keywords',
        getFilterCount: (value) => value.length,
        ...BASE_FILTER
    },
    name: 'a',
    onClick: jest.fn(),
    resetFilter: jest.fn(),
    value: '',
    badgeThreshold: 4
};

describe('FilterSectionHeader', () => {
    it('renders properly with no filters applied', () => {
        const { getByText, container } = render(
            <FilterSectionHeader
                {...FILTER_SECTION_PROPS}
            />
        );
        
        expect(container.querySelector('svg[aria-label="clear"]')).not.toBeInTheDocument();
        getByText(FILTER_SECTION_PROPS.filter.label);
    });

    it('shows the filter badge when filter count is above badge threshold', () => {
        const { queryByText } = render(
            <FilterSectionHeader
                {...FILTER_SECTION_PROPS}
                value={['a', 'b', 'c', 'd']}
            />
        );

        expect(queryByText('b')).not.toBeInTheDocument();
        expect(queryByText('4')).toBeInTheDocument();
    });

    it('shows the filter chips when filter count is below badge threshold', () => {
        const { queryByText } = render(
            <FilterSectionHeader
                {...FILTER_SECTION_PROPS}
                value={['a', 'b', 'c']}
            />
        );

        expect(queryByText('b')).toBeInTheDocument();
        expect(queryByText('3')).not.toBeInTheDocument();
    });

    it('shows the clear button when filters have been applied', () => {
        const { getAllByText, container } = render(
            <FilterSectionHeader
                {...FILTER_SECTION_PROPS}
                value={['a', 'b', 'c']}
            />
        );

        expect(container.querySelector('svg[aria-label="clear"]')).toBeInTheDocument();
        const labels = getAllByText(FILTER_SECTION_PROPS.filter.label);
        expect(labels).toHaveLength(4);
    });

    it('Calls onClick when header is clicked', () => {
        const { getAllByText } = render(
            <FilterSectionHeader
                {...FILTER_SECTION_PROPS}
                value={['a', 'b', 'c']}
            />
        );
        const headerLabel = getAllByText(FILTER_SECTION_PROPS.filter.label);
        fireEvent.click(headerLabel[0]);
        expect(FILTER_SECTION_PROPS.onClick).toHaveBeenCalled();
    });

    it('Calls resetFilter on clear button click', () => {
        const { container } = render(
            <FilterSectionHeader
                {...FILTER_SECTION_PROPS}
                value={['a', 'b', 'c']}
            />
        );

        fireEvent.click(container.querySelector('svg[aria-label="clear"]'));
        expect(FILTER_SECTION_PROPS.resetFilter).toHaveBeenCalled();
    });
});

import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import FilterValueChips from '../FilterValueChips';

const VALUE = ['a', 'b'];

describe('FilterValueChips', () => {
    it('renders null when visible is false', () => {
        const { queryByText } = render(
            <FilterValueChips
                value={VALUE}
                name=''
                resetFilter={() => undefined}
                visible={false}
            />
        );
        
        expect(queryByText(VALUE[0])).not.toBeInTheDocument();
    });

    it('renders chips when visible is true', () => {
        const { queryByText } = render(
            <FilterValueChips
                value={VALUE}
                name=''
                resetFilter={() => undefined}
                visible
            />
        );
        
        expect(queryByText(VALUE[0])).toBeInTheDocument();
    });

    it('threads the values prop through so chips close by value instead of label', () => {
        const resetFilter = jest.fn();
        const { container } = render(
            <FilterValueChips
                value={['Label A', 'Label B']}
                values={['value-a', 'value-b']}
                name='some-filter'
                resetFilter={resetFilter}
                notDefaultValues
                visible
            />
        );

        const x = container.querySelector('svg');
        fireEvent.click(x);
        expect(resetFilter).toHaveBeenCalledWith('some-filter', 'value-a');
    });
});

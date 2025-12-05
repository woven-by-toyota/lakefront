import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import { createChips, getFilterCount } from '../filterSectionHeaderUtil';

describe('createChips', () => {
    it('returns null if value is array with no length', () => {
        expect(createChips([])).toBeNull();
    });

    it('renders null for empty array values', () => {
        const { getByText } = render(
            <div>
                chips
                {createChips([''])}
            </div>
        );

        expect(getByText('chips').querySelectorAll('div')).toHaveLength(0);
    });

    it('renders chip for each non-empty array value', () => {
        const { getByText } = render(
            <div>
                chips
                {createChips(['a', 'b'])}
            </div>
        );

        expect(getByText('chips').querySelectorAll('div')).toHaveLength(6);
    });

    it('renders chips with an "x" when showX is truthy', () => {
        const { container, getAllByText } = render(
            <div>
                chips
                {createChips(['a', 'b'], '', () => undefined, 'label text', true)}
            </div>
        );

        expect(container.querySelector('svg')).toBeInTheDocument();
        expect(getAllByText('label text')).toHaveLength(2);
    });

    it('clicks x and validates callback onClose', () => {
        const onCloseMock = jest.fn();
        const { container } = render(
            <div>
                chips
                {createChips(['chip a', 'chip b'], 'Some Filter', onCloseMock, 'Item Label', true)}
            </div>
        );

        const x = container.querySelector('svg');
        fireEvent.click(x);
        expect(onCloseMock).toBeCalledWith('Some Filter', 'chip a');
    });
});

describe('getFilterCount', () => {
    describe('when filter.getFilterCount is defined', () => {
        it('returns result of applying filter.getFilterCount to provided value', () => {
            expect(getFilterCount('1', { getFilterCount: () => 2 }, true)).toBe(2);
            expect(getFilterCount('1', { getFilterCount: () => 2 }, false)).toBe(2);
        });
    });

    describe('when filter.getFilterCount is not defined', () => {
        it('returns default filter count if filter has been applied', () => {
            expect(getFilterCount('1', {}, true)).toBe(1);
        });

        it('returns 0 if filter has not been applied', () => {
            expect(getFilterCount('1', {}, false)).toBe(0);
        });
    });
});

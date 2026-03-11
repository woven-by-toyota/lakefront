
import { getSortBySVG, getSortDirectionSVG, getTitleForColumn, getTitleForMultiSort, MULTI_SORT_TITLE } from '../tableUtil';
import { renderWithTheme as render } from 'src/lib/testing';

const defaultColumn = {
    disableSortBy: true,
    isSorted: true,
    isSortedDesc: true
};

describe('tableUtil', () => {
    describe('getSortBySVG', () => {
        it('returns null when disableSortBy is truthy', () => {

            const result = getSortBySVG(defaultColumn);

            expect(result).toBeNull();
        });

        it('returns the SVG when disableSortBy is falsy', () => {

            const { container } = render(<>{getSortBySVG({ ...defaultColumn, disableSortBy: false, isSorted: false })}</>);

            expect(container.querySelector('svg.sort-icon')).toBeInTheDocument();
        });

        it('returns the unsorted svg when column isSorted is falsy', () => {

            const { container } = render(<>{getSortBySVG({ ...defaultColumn, disableSortBy: false, isSorted: false })}</>);

            expect(container.querySelector('svg[aria-label="unsorted-icon"]')).toBeInTheDocument();
        });
    });

    describe('getSortDirectionSVG', () => {
        it('returns the arrow-up svg when column is sorted in ascending order', () => {

            const { container } = render(<>{getSortDirectionSVG(false)}</>);

            expect(container.querySelector('svg[aria-label="arrow-up"]')).toBeInTheDocument();
        });

        it('returns arrow-down svg when column is sorted in descending order', () => {

            const { container } = render(<>{getSortDirectionSVG(true)}</>);

            expect(container.querySelector('svg[aria-label="arrow-down"]')).toBeInTheDocument();
        });
    });

    describe('getTitleForMultisort', () => {
        it('returns title as testTitle when multi-sort is disabled', () => {

            const result = getTitleForMultiSort(true, 'testTitle', false);

            expect(result).toBe('testTitle');
        });

        it('returns title as "" when title is not provided', () => {

            const result = getTitleForMultiSort(true, undefined, false);

            expect(result).toBe('');
        });
    });

    describe('getTitleForCloumn', () => {
        it('returns an empty string when sorting is disabled on a column', () => {

            const result = getTitleForColumn(true);

            expect(result).toBe('');
        });

        it(`returns ${MULTI_SORT_TITLE} when sorting is enabled on a column`, () => {

            const result = getTitleForColumn(false);

            expect(result).toBe(MULTI_SORT_TITLE);
        });
    });
});

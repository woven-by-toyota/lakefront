import { StyledArrowDown, StyledArrowUp, StyledUnsorted } from './tableStyles';

export interface Column {
    disableSortBy: boolean;
    isSorted: boolean;
    isSortedDesc: boolean;
}

export const getSortBySVG = ({ disableSortBy, isSorted, isSortedDesc }: Column) => {
    if (disableSortBy) {
        return null;
    }

    return (
        isSorted ? getSortDirectionSVG(isSortedDesc) : <StyledUnsorted aria-label='unsorted-icon' className='sort-icon' />
    );
};

export const getSortDirectionSVG = (isSortedDesc: boolean) =>
    isSortedDesc ? <StyledArrowDown aria-label='arrow-down' className='sort-icon' /> : <StyledArrowUp aria-label='arrow-up' className='sort-icon' />;

export const getTitleForMultiSort = (disableMultiSort: boolean, title: string = '', disableSortBy: boolean): string => {
    return disableMultiSort ? title : getTitleForColumn(disableSortBy);
};

export const MULTI_SORT_TITLE = 'Hold shift & click the column to add to multi-sort';

export const getTitleForColumn = (disableSortBy: boolean): string => {
    return disableSortBy ? '' : MULTI_SORT_TITLE;
};

export const isLastHeader = (
    header: any,
    idx: number,
    totalHeaders: number,
    hasMoreActions: boolean
): boolean => {
    if (header.id === 'more-actions') {
        return true;
    }

    if (hasMoreActions) {
        return idx === totalHeaders - 2;
    }

    return idx === totalHeaders - 1;
};

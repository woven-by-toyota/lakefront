import { StyledArrowDown, StyledArrowUp, StyledUnsorted } from './tableStyles';
import {Cell, flexRender} from "@tanstack/react-table";
import CellErrorBoundary from "./CellErrorBoundary";
import React from "react";

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

export const getCellContent = (cell: Cell<unknown, unknown>, onRenderError?: () => void) => (
  <CellErrorBoundary onError={onRenderError}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
  </CellErrorBoundary>
);

export const getRowIndex = (allRows: any[], rowId: string): number => {
    const index = allRows.findIndex((r: any) => r.id === rowId);
    if (index !== -1) return index;
    const fallback = parseInt(rowId);
    return isNaN(fallback) ? -1 : fallback;
};

export const getGroupValue = (row: any, groupByColumn: string) =>
  row?.getVisibleCells?.()
    ?.find((c: any) => c.column.id === groupByColumn)
    ?.getValue();

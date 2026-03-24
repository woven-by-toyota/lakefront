import React, { FC, Fragment, ReactNode, useState } from 'react';
import {Cell, flexRender} from '@tanstack/react-table';
import ContextMenu from '../ContextMenu';
import { RowHoverContext } from './RowHoverContext';
import { ContextMenuConfig, GroupedRowsConfig, MoreActionsConfig } from './Table';
import CellErrorBoundary from './CellErrorBoundary';

export interface TableRowProps {
    row: any;
    rowProps?: object;
    renderRowSubComponent?: ({ row }: { row: any }) => ReactNode;
    contextMenuConfig?: ContextMenuConfig;
    moreActionsConfig?: MoreActionsConfig;
    onRenderError?: () => void;
    groupedRows?: GroupedRowsConfig;
}

const TableRow: FC<TableRowProps> = ({ row, rowProps, renderRowSubComponent, contextMenuConfig, moreActionsConfig, onRenderError, groupedRows }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Get the menu items for this specific row
    const menuItems = contextMenuConfig?.getRowMenuItems(row) ?? [];

    const hoverActionStyle = moreActionsConfig?.visibleOnHover
        ? { height: '75px', width: '75px' }
        : {};

    const commonProps = {
        style: {
            ...(rowProps as any)?.style,
            ...hoverActionStyle,
        },
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
    };

    // Helper function to find group cell info
    const getGroupCellInfo = (cell: Cell<unknown, unknown>, rowIndex: number, allRows: any[]) => {
        const currentValue = cell.getValue();
        const groupColumnId = groupedRows!.groupBy;

        // Check if previous row has same value (determines if we should render)
        let isFirstOccurrence = true;
        if (rowIndex > 0 && allRows[rowIndex - 1]) {
            const prevRowCell = allRows[rowIndex - 1].getVisibleCells?.()
                ?.find((c: any) => c.column.id === groupColumnId);
            if (prevRowCell && prevRowCell.getValue() === currentValue) {
                isFirstOccurrence = false;
            }
        }

        if (!isFirstOccurrence) {
            return { shouldRender: false, spanCount: 0 };
        }

        // Count consecutive rows with same value
        let spanCount = 1;
        for (let i = rowIndex + 1; i < allRows.length; i++) {
            const nextRow = allRows[i];
            if (!nextRow?.getVisibleCells) break;

            const nextRowCell = nextRow.getVisibleCells()
                .find((c: any) => c.column.id === groupColumnId);
            if (nextRowCell && nextRowCell.getValue() === currentValue) {
                spanCount++;
            } else {
                break;
            }
        }

        return { shouldRender: true, spanCount };
    };

    const renderCell = (cell: Cell<unknown, unknown>, rowIndex: number, allRows: any[]): React.ReactElement | null => {
        const isGroupedColumn = groupedRows?.enabled && cell.column.id === groupedRows.groupBy;

        if (isGroupedColumn) {
            const { shouldRender, spanCount } = getGroupCellInfo(cell, rowIndex, allRows);

            if (!shouldRender) {
                return null;
            }

            return (
                <td key={cell.id} rowSpan={spanCount} style={{
                    backgroundColor: '#f8f9fa',
                    borderRight: '1px solid #dee2e6',
                    verticalAlign: 'top',
                    fontWeight: '600'
                }}>
                    <CellErrorBoundary onError={onRenderError}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </CellErrorBoundary>
                </td>
            );
        }

        // Regular cell
        return (
            <td key={cell.id}>
                <CellErrorBoundary onError={onRenderError}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </CellErrorBoundary>
            </td>
        );
    };

    const allRows = row.getContext?.()?.table.getRowModel().rows || [];
    const rowIndex = allRows.findIndex((r: any) => r.id === row.id);

    const cells = row.getVisibleCells()
        .map((cell: Cell<unknown, unknown>) => renderCell(cell, rowIndex, allRows))
        .filter((cellElement: React.ReactElement | null): cellElement is React.ReactElement => cellElement !== null);

    return (
        <RowHoverContext.Provider value={isHovered}>
            <Fragment key={row.id}>
                {menuItems.length > 0 ? (
                    <ContextMenu {...commonProps} menuItems={menuItems} wrapper='tr'>
                        {cells}
                    </ContextMenu>
                ) : (
                    <tr {...commonProps}>
                        {cells}
                    </tr>
                )}
                {row.getIsExpanded() && renderRowSubComponent ? renderRowSubComponent({ row }) : null}
            </Fragment>
        </RowHoverContext.Provider>
    );
};

export default TableRow;

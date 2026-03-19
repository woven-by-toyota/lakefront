import { FC, Fragment, ReactNode, useState } from 'react';
import { flexRender } from '@tanstack/react-table';
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

    const cells = row.getVisibleCells().map((cell: any, cellIndex: number) => {
        // Check if this is a grouped column and if we should render it with merged cells
        if (groupedRows?.enabled && cell.column.id === groupedRows.groupBy) {
            // Check if this is the first row with this group value
            const currentValue = cell.getValue();
            const rowIndex = parseInt(row.id);

            // Find all consecutive rows with the same group value
            let spanCount = 1;
            const allRows = cell.getContext().table.getRowModel().rows;

            // Count how many consecutive rows have the same value
            for (let i = rowIndex + 1; i < allRows.length; i++) {
                const nextRow = allRows[i];
                const nextCell = nextRow.getVisibleCells().find((c: any) => c.column.id === groupedRows.groupBy);
                if (nextCell && nextCell.getValue() === currentValue) {
                    spanCount++;
                } else {
                    break;
                }
            }

            // Check if this is the first occurrence of this group value
            let isFirstOccurrence = true;
            if (rowIndex > 0) {
                const prevRow = allRows[rowIndex - 1];
                const prevCell = prevRow.getVisibleCells().find((c: any) => c.column.id === groupedRows.groupBy);
                if (prevCell && prevCell.getValue() === currentValue) {
                    isFirstOccurrence = false;
                }
            }

            if (isFirstOccurrence) {
                // This is the first row with this group value - show with rowspan
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
            } else {
                // This is not the first occurrence - skip rendering this cell
                return null;
            }
        } else {
            // Regular cell
            return (
                <td key={cell.id}>
                    <CellErrorBoundary onError={onRenderError}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </CellErrorBoundary>
                </td>
            );
        }
    }).filter(cell => cell !== null);

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

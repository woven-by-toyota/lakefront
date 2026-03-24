import React, {FC, Fragment, ReactElement, ReactNode, useState} from 'react';
import {Cell, flexRender} from '@tanstack/react-table';
import ContextMenu from '../ContextMenu';
import { RowHoverContext } from './RowHoverContext';
import { ContextMenuConfig, GroupedRowsConfig, MoreActionsConfig } from './Table';
import CellErrorBoundary from './CellErrorBoundary';
import { GroupedCell, GroupedRowCell } from './tableStyles';

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

    const cells = row.getVisibleCells().map((cell: Cell<unknown, unknown>): ReactElement | null => {
        // Helper function to get group information for styling (moved inside cell mapping)
        const getGroupInfo = () => {
            if (!groupedRows?.enabled) return null;

            const allRows = cell.getContext().table.getRowModel().rows;
            const rowIndex = allRows.findIndex((r: any) => r.id === row.id);
            if (rowIndex === -1) return null;

            const groupByColumn = groupedRows.groupBy;
            const currentValue = allRows[rowIndex].getVisibleCells()
                .find((c: any) => c.column.id === groupByColumn)?.getValue();

            // Find which group index this is (for alternating colors)
            const uniqueGroups: any[] = [];
            let groupIndex = -1;

            for (let i = 0; i <= rowIndex; i++) {
                const cellValue = allRows[i].getVisibleCells()
                    .find((c: any) => c.column.id === groupByColumn)?.getValue();

                if (!uniqueGroups.includes(cellValue)) {
                    uniqueGroups.push(cellValue);
                }

                if (cellValue === currentValue && groupIndex === -1) {
                    groupIndex = uniqueGroups.indexOf(cellValue);
                }
            }

            // Check if this is the last row in the group
            let isLastInGroup = true;
            if (rowIndex < allRows.length - 1) {
                const nextRowValue = allRows[rowIndex + 1].getVisibleCells()
                    .find((c: any) => c.column.id === groupByColumn)?.getValue();
                isLastInGroup = nextRowValue !== currentValue;
            }

            return { groupIndex, isLastInGroup };
        };

        const groupInfo = getGroupInfo();
        // Check if this is a grouped column and if we should render it with merged cells
        if (groupedRows?.enabled && cell.column.id === groupedRows.groupBy) {
            const currentValue = cell.getValue();
            const allRows = cell.getContext().table.getRowModel().rows;

            // Use the row's index in the table for reliable positioning
            let rowIndex = allRows.findIndex((r: any) => r.id === row.id);
            if (rowIndex === -1) {
                // Fallback if findIndex fails - try parseInt
                // Most table implementations use row ids that include the index (e.g. "0", "1"), so we can attempt to parse the index from the id
                const fallbackIndex = parseInt(row.id);
                if (isNaN(fallbackIndex)) {
                    // If we can't determine index, render as regular cell
                    return (
                        <td key={cell.id}>
                            <CellErrorBoundary onError={onRenderError}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </CellErrorBoundary>
                        </td>
                    );
                } else {
                    rowIndex = fallbackIndex;
                }
            }

            // Check if previous row has same value (determines if we should render)
            let isFirstOccurrence = true;
            if (rowIndex > 0) {
                const prevRow = allRows[rowIndex - 1];
                const prevCell = prevRow?.getVisibleCells?.()?.find((c: any) => c.column.id === groupedRows.groupBy);
                if (prevCell && prevCell.getValue() === currentValue) {
                    isFirstOccurrence = false;
                }
            }

            if (!isFirstOccurrence) {
                // This is not the first occurrence - skip rendering this cell
                return null;
            }

            // Count consecutive rows with same value for rowspan
            let spanCount = 1;
            for (let i = rowIndex + 1; i < allRows.length; i++) {
                const nextRow = allRows[i];
                const nextCell = nextRow?.getVisibleCells?.()?.find((c: any) => c.column.id === groupedRows.groupBy);
                if (nextCell && nextCell.getValue() === currentValue) {
                    spanCount++;
                } else {
                    break;
                }
            }

            // Check if this is the last group in the table for the grouped cell
            // If rowIndex + spanCount reaches or exceeds the total rows, this is the last group
            let isGroupedCellLastInGroup = rowIndex + spanCount >= allRows.length;

            // This is the first occurrence - render with rowspan
            return (
                <GroupedCell key={cell.id} rowSpan={spanCount} isLastInGroup={isGroupedCellLastInGroup}>
                    <CellErrorBoundary onError={onRenderError}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </CellErrorBoundary>
                </GroupedCell>
            );
        } else {
            // Regular cell - apply group styling if grouping is enabled
            if (groupedRows?.enabled && groupInfo) {
                return (
                    <GroupedRowCell
                        key={cell.id}
                        groupIndex={groupInfo.groupIndex}
                        isLastInGroup={groupInfo.isLastInGroup}
                        alternatingColors={groupedRows.alternatingColors}
                    >
                        <CellErrorBoundary onError={onRenderError}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </CellErrorBoundary>
                    </GroupedRowCell>
                );
            } else {
                // Normal cell when grouping is disabled
                return (
                    <td key={cell.id}>
                        <CellErrorBoundary onError={onRenderError}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </CellErrorBoundary>
                    </td>
                );
            }
        }
    }).filter((cellElement: ReactElement | null): cellElement is ReactElement => cellElement !== null);

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

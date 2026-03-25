import React, {FC, Fragment, ReactElement, ReactNode, useState} from 'react';
import {Cell} from '@tanstack/react-table';
import ContextMenu from '../ContextMenu';
import { RowHoverContext } from './RowHoverContext';
import { ContextMenuConfig, GroupedRowsConfig, MoreActionsConfig } from './Table';
import { GroupedCell, GroupedRowCell } from './tableStyles';
import {getCellContent, getGroupValue, getRowIndex} from "./tableUtil";

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
        const isGroupingEnabled = groupedRows?.enabled;
        const isGroupByColumn = cell.column.id === groupedRows?.groupBy;

        const allRows = cell.getContext().table.getRowModel().rows;
        const rowIndex = getRowIndex(allRows, row.id);
        const groupByColumn = groupedRows?.groupBy;
        const currentValue = rowIndex !== -1 && groupByColumn ? getGroupValue(allRows[rowIndex], groupByColumn) : null;

        // --- Grouped column cell (with rowspan) ---
        if (isGroupingEnabled && isGroupByColumn) {
            if (rowIndex === -1) {
                return <td key={cell.id}>{getCellContent(cell, onRenderError)}</td>;
            }

            const prevValue = rowIndex > 0 && groupByColumn ? getGroupValue(allRows[rowIndex - 1], groupByColumn) : null;
            if (prevValue === currentValue) return null; // not first occurrence, skip

            let spanCount = 1;
            while (
                rowIndex + spanCount < allRows.length &&
                groupByColumn &&
                getGroupValue(allRows[rowIndex + spanCount], groupByColumn) === currentValue
            ) {
                spanCount++;
            }

            return (
                <GroupedCell
                    key={cell.id}
                    rowSpan={spanCount}
                    isLastInGroup={rowIndex + spanCount >= allRows.length}
                >
                    {getCellContent(cell, onRenderError)}
                </GroupedCell>
            );
        }

        if (isGroupingEnabled && rowIndex !== -1) {
            const nextValue = rowIndex < allRows.length - 1 && groupByColumn
                ? getGroupValue(allRows[rowIndex + 1], groupByColumn)
                : null;
            const isLastInGroup = nextValue !== currentValue;

            let groupIndex = 0;
            if (groupedRows.alternatingColors && groupByColumn) {
                const uniqueGroups: any[] = [];
                for (let i = 0; i <= rowIndex; i++) {
                    const val = getGroupValue(allRows[i], groupByColumn);
                    if (!uniqueGroups.includes(val)) uniqueGroups.push(val);
                }
                groupIndex = uniqueGroups.indexOf(currentValue);
            }

            return (
                <GroupedRowCell
                    key={cell.id}
                    groupIndex={groupIndex}
                    isLastInGroup={isLastInGroup}
                    alternatingColors={groupedRows.alternatingColors}
                >
                    {getCellContent(cell, onRenderError)}
                </GroupedRowCell>
            );
        }

        return <td key={cell.id}>{getCellContent(cell, onRenderError)}</td>;

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

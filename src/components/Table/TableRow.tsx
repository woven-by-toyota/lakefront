import { FC, Fragment, ReactNode, useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import ContextMenu from '../ContextMenu';
import { RowHoverContext } from './RowHoverContext';
import { ContextMenuConfig, MoreActionsConfig } from './Table';
import CellErrorBoundary from './CellErrorBoundary';

export interface TableRowProps {
    row: any;
    rowProps?: object;
    renderRowSubComponent?: ({ row }: { row: any }) => ReactNode;
    contextMenuConfig?: ContextMenuConfig;
    moreActionsConfig?: MoreActionsConfig;
    onRenderError?: () => void;
}

const TableRow: FC<TableRowProps> = ({ row, rowProps, renderRowSubComponent, contextMenuConfig, moreActionsConfig, onRenderError }) => {
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

    const cells = row.getVisibleCells().map((cell: any) => (
        <td key={cell.id}>
            <CellErrorBoundary onError={onRenderError}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </CellErrorBoundary>
        </td>
    ));

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

import type React from 'react';
import { type ReactNode, type RefCallback, useCallback, useState } from 'react';
import { ItemGridContainer } from './itemGridStyles';

export interface ItemGridProps {
    /**
     * The children to render inside the grid container.
     */
    children?: ReactNode;
    /**
     * This is the max number of columns that populates in a row.
     */
    maxColumns: number;
    /**
     * This is to set the minimum width for each column.
     */
    columnWidthMin?: string;
    /**
     * This to set the gap between rows and columns.
     */
    gridGap?: { rowGap?: number; columnGap?: number };
    /**
     * This would recalculate the size if set to true.
     */
    shouldRecalculateSize?: boolean;
    /**
     * This is to set the inner width.
     */
    innerWidth?: number;
    /**
     * The classes to pass to the item grid.
     */
    className?: string;
}

/**
 * Item Grid Component
 *
 * This component is used to display the items in a grid. The component takes initial props like the maximum columns
 * that needs to be displayed in each row, sets the minimum width for each column and the grid gap between rows and columns.
 */
const ItemGrid: React.FC<ItemGridProps> = ({
    children,
    maxColumns,
    columnWidthMin = '0',
    gridGap = {},
    shouldRecalculateSize = true,
    innerWidth = 0,
    className
}) => {
    const { rowGap = 0, columnGap = 0 } = gridGap;
    const [columnWidth, setColumnWidth] = useState<number>(0);

    const gridContainerRef: RefCallback<any> = useCallback(
        (node: { getBoundingClientRect: () => { width: number } }) => {
            if (node && shouldRecalculateSize) {
                const { width } = node.getBoundingClientRect();

                const scrollbarReserved = 15;
                const totalColumnGap = (maxColumns - 1) * columnGap;
                const availableColWidth = (width - scrollbarReserved - totalColumnGap) / maxColumns;

                // Calculate the correct width of the CSS Grid columns in terms of VW so they can retain the max columns,
                // grow with the viewport, and maintain the same size when the container shrinks for the drawer opening.
                const widthInRatio = (availableColWidth / innerWidth) * 100;
                setColumnWidth(widthInRatio);
            }
        },
        [innerWidth]
    );

    return (
        <div
            ref={gridContainerRef}
            className={className}
        >
            <ItemGridContainer
                columnWidthMin={columnWidthMin}
                columnWidth={columnWidth}
                rowGap={rowGap}
                columnGap={columnGap}
            >
                {children}
            </ItemGridContainer>
        </div>
    );
};

export default ItemGrid;

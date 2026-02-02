import React, { useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  flexRender,
  SortingState,
  ColumnDef,
  ColumnSort,
  ExpandedState,
  TableOptions
} from '@tanstack/react-table';
import { HideableTHead, StyledHeader, StyledHeaderContent, TableStyle } from './tableStyles';
import { getSortBySVG, getTitleForMultiSort } from './tableUtil';
import { MenuItem } from '../ContextMenu';
import TableRow from './TableRow';
import { MoreActionsButton } from '../../index';
import { useRowHover } from './RowHoverContext';

export interface TableSortByOptions {
    id: string;
    desc: boolean;
}

export interface ContextMenuConfig {
    getRowMenuItems: (row: any) => MenuItem[];
}

export interface MoreActionsConfig {
    getRowActionItems: (row: any) => MenuItem[];
    visibleOnHover?: boolean;
    width?: number;
}

export interface TableProps <T = any> {
    /**
     * This is to set the data for the table.
     */
    data: Array<T> | null | undefined;
    /**
     * This is to set the columns of the table.
     */
    columns: Array<ColumnDef<T, any>>;
    /**
     * This is to set the additional properties on the table like disableSortRemove,
     * autoResetSortBy, disableMultiSort, etc.
     */
    options?: Partial<TableOptions<any>>;
    /**
     * This is to set the row properties.
     */
    rowProps?: any;
    /**
     * This is to set the display message when there is no data.
     */
    noDataMessage?: string;
    /**
     * This is to set some additional style on the table.
     */
    style?: any;
    /**
     * This is to set a class on the table.
     */
    className?: string;
    /**
    * Note: MUST BE MEMOIZED. This is to set the initial sorting on the table.
    * When an array of items is provided, the order dictates the priority of sorting. Example: value --> title --> percentage.
    */
    initialSortBy?: SortingState | ColumnSort;

    /**
     * This event is triggered when the sorting is changed on the table.
     * The first argument is the sorted column and the second argument is the sortBy array
     * (for if table is sorted by multiple columns).
     */
    onChangeSort?({ id, desc }: TableSortByOptions, sortedBy?: TableSortByOptions[]): void;
    /**
     * This is to set the row sub component on the table.
     */
    renderRowSubComponent?({ row }: { row: any }): React.ReactNode;
    /**
     * This allows displaying the table rows without headers.
     * This is defaulted to false.
     */
    hideHeaders?: boolean;

    /**
     * Configuration for the row-level context menu.
     * If provided, a context menu will be enabled for each row.
     */
    contextMenuConfig?: ContextMenuConfig;

    moreActionsConfig?: MoreActionsConfig;
}

/**
 *  The Table Component is used to render table with specified columns and data.
 *  The no data message can be set when the data is not present.
 *  You can set initial sorting on the table. OnChangeSort is triggered everytime the sorting is changed on the table.
 *  For more information about react-table please check the link https://tanstack.com/table/latest
 */
const Table: React.FC<TableProps> = ({ className,
    columns,
    data,
    options = {},
    noDataMessage = 'No data available',
    style,
    onChangeSort,
    initialSortBy,
    rowProps,
    renderRowSubComponent,
    hideHeaders = false,
    contextMenuConfig,
    moreActionsConfig
}) => {
        /** initialSortBy must be memoized */
        const initialSortByData: SortingState = useMemo(
            () =>
                initialSortBy
                    ? (Array.isArray(initialSortBy) ? initialSortBy : [initialSortBy])
                    : [],
            [initialSortBy]
        );

        const [sorting, setSorting] = React.useState<SortingState>(initialSortByData);
        const [expanded, setExpanded] = React.useState<ExpandedState>({});

    const memoizedColumns = useMemo(() => {
        if (moreActionsConfig) {
            return [
                ...columns,
                {
                    id: 'more-actions',
                    header: '',
                    enableSorting: false,
                    cell: ({ row }: { row: any }) => {
                        // hook to get the hover state for this specific row
                        const isHovered = useRowHover();
                        // Determine if the button should be visible
                        const isButtonVisible = !moreActionsConfig?.visibleOnHover || isHovered;
                        const actionItems = moreActionsConfig.getRowActionItems(row);
                        if (!actionItems || actionItems.length === 0) {
                            return null;
                        }
                        return isButtonVisible ? <MoreActionsButton items={actionItems} /> : <div style={{width: 75}}/>;
                    },
                    size: moreActionsConfig?.width
                } as ColumnDef<any, any>,
            ];
        }
        return columns;
    }, [columns, moreActionsConfig]);

        // Use the state and functions returned from useReactTable to build your UI
        const table = useReactTable({
            data: data ?? [],
            columns: memoizedColumns,
            state: {
                sorting,
                expanded
            },
            onSortingChange: setSorting,
            onExpandedChange: setExpanded,
            getCoreRowModel: getCoreRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getExpandedRowModel: getExpandedRowModel(),
            enableExpanding: true,
            getRowCanExpand: () => true,
            autoResetExpanded: true,
            ...options,
        });

        useEffect(() => {
            if (onChangeSort && sorting.length) {
                onChangeSort(sorting[0], sorting);
            }
        }, [sorting, onChangeSort]);

        // Render the UI for your table
        return (
            <TableStyle className={className} style={style}>
                <HideableTHead hide={hideHeaders}>
                    {table.getHeaderGroups().map((headerGroup: any) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header: any) => {
                                const columnSize = header.column.columnDef.size ?? header.getSize();
                                return (
                                <th
                                    key={header.id}
                                    {...({ width: columnSize } as any)}
                                    style={{ width: columnSize }}
                                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                    title={getTitleForMultiSort(
                                        !options.enableMultiSort,
                                        header.column.getCanSort() ? 'Toggle sorting' : '',
                                        !header.column.getCanSort()
                                    )}
                                >
                                    <StyledHeader>
                                        <StyledHeaderContent>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </StyledHeaderContent>
                                        <StyledHeaderContent>{getSortBySVG({
                                            disableSortBy: !header.column.getCanSort(),
                                            isSorted: header.column.getIsSorted() !== false,
                                            isSortedDesc: header.column.getIsSorted() === 'desc'
                                        })}</StyledHeaderContent>
                                    </StyledHeader>
                                </th>
                                );
                            })}
                        </tr>
                    ))}
                </HideableTHead>
                <tbody>
                    {table.getRowModel().rows.map((row: any) => {
                        return (
                            <TableRow
                                key={row.id}
                                row={row}
                                rowProps={rowProps}
                                renderRowSubComponent={renderRowSubComponent}
                                contextMenuConfig={contextMenuConfig}
                                moreActionsConfig={moreActionsConfig}
                            />
                        );
                    })}
                    {table.getRowModel().rows.length === 0 && (
                        <tr>
                            <td colSpan={memoizedColumns.length}>{noDataMessage}</td>
                        </tr>
                    )}
                </tbody>
            </TableStyle>
        );
    };

export default Table;

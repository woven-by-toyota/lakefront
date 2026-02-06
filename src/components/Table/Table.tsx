import React, { ComponentPropsWithoutRef, useEffect, useMemo, useRef, useState } from 'react';
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
  TableOptions,
  VisibilityState
} from '@tanstack/react-table';
import { HideableTHead, StyledHeader, StyledHeaderContent, TableStyle } from './tableStyles';
import { getSortBySVG, getTitleForMultiSort } from './tableUtil';
import { MenuItem } from '../ContextMenu';
import TableRow from './TableRow';
import { MoreActionsButton } from '../../index';
import { useRowHover } from './RowHoverContext';
import Loading from '../Loading/Loading';
import TableSettings from './TableSettings';
import { TableWrapper } from './tableSettingsStyles';

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

export interface InfiniteScrollConfig {
  /**
   * Callback function to fetch more data when user scrolls to the bottom.
   * Should handle the logic to load next page of data.
   */
  onLoadMore: () => void | Promise<void>;
  /**
   * Indicates whether more data is currently being loaded.
   */
  isLoading: boolean;
  /**
   * Indicates whether there is more data available to load.
   */
  hasMore: boolean;
  /**
   * Custom loading component to display when loading more data.
   * If not provided, a default Loading component will be used.
   */
  loadingComponent?: React.ReactNode;
  /**
   * Threshold in pixels from the bottom to trigger loading.
   * Default is 200px.
   */
  threshold?: number;
  /**
   * Enable sticky table headers that remain visible while scrolling.
   * Default is true when infinite scroll is enabled.
   */
  stickyHeaders?: boolean;
}

export interface TableSettingsConfig {
  /**
   * Configuration for table settings panel.
   */
  columnConfig?: {
    /**
     * Enable column hiding feature.
     * When true, users can toggle column visibility through the settings panel.
     */
    enableColumnHiding: boolean;
    /**
     * Function to transform column IDs into user-friendly labels
     * @param columnId
     */
    columnLabelTransform?: (columnId: string) => string;
    /**
     * Watch for column visibility change events.
     * @param updatedVisibility
     */
    columnChangeSubscriber?: (updatedVisibility: VisibilityState) => void;
    /**
     * Initial column visibility state.
     * Object mapping column IDs to boolean values (true = visible, false = hidden).
     * This only sets the initial state and won't affect subsequent visibility updates.
     */
    initialColumnVisibility?: VisibilityState;
  };
}

export interface TableProps<T = any> {
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

  /**
   * Configuration for infinite scroll pagination.
   * If provided, the table will support infinite scroll with automatic data loading.
   */
  infiniteScroll?: InfiniteScrollConfig;

  /**
   * Enable sticky table headers that remain visible while scrolling.
   * When infiniteScroll is provided, this defaults to true. Otherwise defaults to false.
   */
  stickyHeaders?: boolean;

  /**
   * Configuration for table settings panel.
   * Provides options like column hiding, filtering, etc.
   */
  tableSettings?: TableSettingsConfig;
  /**
   * Additional props for the table wrapper when tableSettings is enabled.
   */
  wrapperProps?: ComponentPropsWithoutRef<'div'>;
}

/**
 *  The Table Component is used to render table with specified columns and data.
 *  The no data message can be set when the data is not present.
 *  You can set initial sorting on the table. OnChangeSort is triggered everytime the sorting is changed on the table.
 *  For more information about react-table please check the link https://tanstack.com/table/latest
 */
const Table: React.FC<TableProps> = ({
  className,
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
  moreActionsConfig,
  infiniteScroll,
  stickyHeaders,
  tableSettings,
  wrapperProps
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
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    tableSettings?.columnConfig?.initialColumnVisibility ?? {}
  );

  // Check if any table settings have been modified
  const hasModifiedSettings = useMemo(() => {
    return Object.values(columnVisibility).some(visible => visible === false);
  }, [columnVisibility]);

  // Determine if sticky headers should be enabled
  // Default to true if infiniteScroll is enabled, unless explicitly overridden
  const shouldUseStickyHeaders = useMemo(() => {
    if (stickyHeaders !== undefined) {
      return stickyHeaders;
    }

    // Check if stickyHeaders is set in infiniteScroll config
    if (infiniteScroll?.stickyHeaders !== undefined) {
      return infiniteScroll.stickyHeaders;
    }

    // Default to true if infiniteScroll is enabled
    return !!infiniteScroll;
  }, [stickyHeaders, infiniteScroll]);

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
            return isButtonVisible ? <MoreActionsButton items={actionItems} /> : <div style={{ width: 75 }} />;
          },
          size: moreActionsConfig?.width
        } as ColumnDef<any, any>
      ];
    }
    return columns;
  }, [columns, moreActionsConfig]);

  // Use the state and functions returned from useReactTable to build your UI
  const enableMultiSort = options.enableMultiSort ?? true;
  const table = useReactTable({
    data: data ?? [],
    columns: memoizedColumns,
    state: {
      sorting,
      expanded,
      columnVisibility
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    enableExpanding: true,
    getRowCanExpand: () => true,
    autoResetExpanded: true,
    enableMultiSort,
    ...options
  });

  useEffect(() => {
    if (onChangeSort && sorting.length) {
      onChangeSort(sorting[0], sorting);
    }
  }, [sorting, onChangeSort]);

  // Ref for the loading indicator at the bottom of the table
  const loadMoreRef = useRef<HTMLTableRowElement>(null);

  // Infinite scroll effect
  useEffect(() => {
    if (!infiniteScroll) return;

    const { onLoadMore, isLoading, hasMore, threshold = 200 } = infiniteScroll;

    // Don't set up observer if already loading or no more data
    if (isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      {
        root: null, // viewport
        rootMargin: `${threshold}px`,
        threshold: 0.1
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [infiniteScroll]);

  // Column visibility change subscriber effect
  useEffect(() => {
    if (tableSettings?.columnConfig?.columnChangeSubscriber) {
      tableSettings.columnConfig.columnChangeSubscriber(columnVisibility);
    }
  }, [columnVisibility, tableSettings]);

  const tableComponent = (
    <TableStyle className={className} style={style}>
      <HideableTHead
        hide={hideHeaders}
        sticky={shouldUseStickyHeaders}
        hasSettings={Boolean(tableSettings) && shouldUseStickyHeaders}
      >
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
                    !enableMultiSort,
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
      {infiniteScroll && infiniteScroll.hasMore && (
        <tr ref={loadMoreRef}>
          <td colSpan={memoizedColumns.length} style={{ textAlign: 'center', padding: '1rem' }}>
            {infiniteScroll.isLoading && (
              infiniteScroll.loadingComponent || <Loading label="Loading more..." />
            )}
          </td>
        </tr>
      )}
      </tbody>
    </TableStyle>
  );

  // Render table only
  if (!tableSettings) {
    return tableComponent;
  }

  // Render table with settings panel
  return (
    <TableWrapper hasSettings={Boolean(tableSettings)} stickyHeaders={shouldUseStickyHeaders} {...wrapperProps}>
      <TableSettings
        {...tableSettings}
        columns={table.getAllLeafColumns()}
        onColumnVisibilityChange={(columnId, visible) => {
          setColumnVisibility((prev) => ({
            ...prev,
            [columnId]: visible
          }));
        }}
        getColumnVisibility={(columnId) => columnVisibility[columnId] !== false}
        stickyHeaders={shouldUseStickyHeaders}
        hasModifiedSettings={hasModifiedSettings}
      />
      {tableComponent}
    </TableWrapper>
  );
};

export default Table;

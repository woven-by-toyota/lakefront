import React, { ComponentPropsWithoutRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  VisibilityState,
  ColumnSizingState
} from '@tanstack/react-table';
import {
  ColumnResizeHandle,
  ErrorMessage,
  HeaderCell,
  HideableTHead,
  ResizerContainer,
  StyledHeader,
  StyledHeaderContent,
  TableStyle
} from './tableStyles';
import { getSortBySVG, getTitleForMultiSort, isLastHeader } from './tableUtil';
import { MenuItem } from '../ContextMenu';
import TableRow from './TableRow';
import { MoreActionsButton } from '../../index';
import { useRowHover } from './RowHoverContext';
import Loading from '../Loading/Loading';
import TableSettings from './TableSettings';
import { DEFAULT_SETTINGS_ROW_HEIGHT, MIN_SETTINGS_ROW_HEIGHT, TableWrapper } from './tableSettingsStyles';
import { convertToCSV, downloadFile } from './tableDownloadUtils';
import {
  getConfigurableColumnIds,
  getConfigurableColumnIdsFromDefs,
  getVisibleColumnIds,
  isPresetModified,
  presetToVisibility,
  TableColumnPreset,
  TableColumnPresetState
} from './tableColumnPresetUtil';

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

export interface GroupedRowsConfig {
  /**
   * Enable grouped rows functionality with Excel-style merged cells.
   */
  enabled: boolean;
  /**
   * Column ID to group by for Excel-style merged cells.
   * For example: 'platform' will merge platform column cells.
   */
  groupBy: string;
  /**
   * Enable alternating background colors for grouped rows.
   * When true, alternates between primary and secondary background colors for each group.
   */
  alternatingColors?: boolean;
}

export interface TableSettingsConfig {
  /**
   * Enable the display of the settings panel.
   */
  display?: boolean;
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
    /**
     * Watch for column sizing change events.
     * @param updatedSizing
     */
    columnSizingChangeSubscriber?: (updatedSizing: ColumnSizingState) => void;
    /**
     * Initial column sizing state.
     * Object mapping column IDs to their width in pixels.
     * This only sets the initial state and won't affect subsequent sizing updates.
     */
    initialColumnSizing?: ColumnSizingState;
    /**
     * Named column presets displayed in the "Column Configuration" section of the settings panel.
     * Applying a preset shows exactly its columns and hides every other configurable column.
     * The section is not rendered when this is omitted or empty.
     */
    presets?: TableColumnPreset[];
    /**
     * The id of the preset applied on mount. When it matches a preset, that preset's columns seed
     * the initial visibility state, taking precedence over initialColumnVisibility.
     */
    initialPresetId?: string;
    /**
     * True when the columns saved for `initialPresetId` had been modified away from the preset.
     * The preset stays selected and shows as modified, and `initialColumnVisibility` seeds the
     * initial visibility instead of the preset's own columns, so the modifications are restored.
     */
    initialPresetModified?: boolean;
    /**
     * Watch for column preset changes. Fires when a preset is applied, reverted, or when the
     * visible columns start or stop deviating from the applied preset. Use this to persist the
     * user's column configuration to your own preferences API.
     * @param presetState
     */
    presetChangeSubscriber?: (presetState: TableColumnPresetState) => void;
    /**
     * When provided, a "Save as new preset" button is rendered in the unsaved changes callout.
     * Naming and persisting the new preset is the consumer's responsibility - push the result back
     * in through `presets` with `userDefined: true` so it appears in the separated group.
     *
     * Return the new preset's id (or a promise of it) to have it become the applied preset, which
     * clears the unsaved changes callout. Return nothing to leave the current selection alone.
     * @param columnIds the currently visible configurable column ids
     * @param sourcePreset the preset the columns were modified from
     */
    onSavePreset?: (
      columnIds: string[],
      sourcePreset: TableColumnPreset | null
    ) => string | void | Promise<string | void>;
    /**
     * When provided, a "Save" button is rendered in the unsaved changes callout, overwriting the
     * applied preset's columns rather than creating a new preset. Only user defined presets can be
     * overwritten - for built in presets the button renders disabled, since there is nothing the
     * consumer can persist. Push the new columns back in through `presets`.
     * @param presetId the applied preset's id
     * @param columnIds the currently visible configurable column ids
     */
    onUpdatePreset?: (presetId: string, columnIds: string[]) => void | Promise<void>;
    /**
     * When provided, user defined preset rows render a delete control. lakefront does not confirm
     * the deletion - prompt the user and persist the removal here, then push the shortened list
     * back in through `presets`.
     *
     * Deleting the applied preset clears the selection and leaves the visible columns alone.
     * @param presetId the preset to delete
     */
    onDeletePreset?: (presetId: string) => void | Promise<void>;
  };
  /**
   * Enable table data download feature.
   * When true, a download button will be displayed that exports the current table data as CSV.
   */
  enableDownload?: boolean;
  /**
   * Custom filename for downloaded CSV file.
   * If not provided, defaults to 'table-data.csv'.
   */
  downloadFilename?: string;
  /**
   * Display style for settings buttons.
   * 'icons' (default): Shows icon buttons with settings and download icons.
   * 'text': Shows text buttons with "Settings" and "Export CSV" labels, bordered layout.
   */
  buttonDisplayStyle?: 'icons' | 'text';
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
   * This is to set the display message when there is an error rendering the table.
   */
  errorMessage?: string;
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
  /**
   * Configuration for grouped rows functionality.
   * When provided, rows will be grouped by the specified column.
   */
  groupedRows?: GroupedRowsConfig;
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
  errorMessage = 'Error: Data provided to the table was invalid.',
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
  wrapperProps,
  groupedRows
}) => {
  /** initialSortBy must be memoized */
  const initialSortByData: SortingState = useMemo(
    () =>
      initialSortBy
        ? (Array.isArray(initialSortBy) ? initialSortBy : [initialSortBy])
        : [],
    [initialSortBy]
  );

  const presets = tableSettings?.columnConfig?.presets;
  const initialPresetId = tableSettings?.columnConfig?.initialPresetId;

  const [sorting, setSorting] = React.useState<SortingState>(initialSortByData);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [activePresetId, setActivePresetId] = useState<string | null>(() => {
    return presets?.some((preset) => preset.id === initialPresetId) ? (initialPresetId as string) : null;
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const { initialColumnVisibility, initialPresetModified } = tableSettings?.columnConfig ?? {};
    const initialPreset = presets?.find((preset) => preset.id === initialPresetId);

    // A preset saved in a modified state keeps the saved visibility, so the modifications survive
    if (initialPresetModified && initialColumnVisibility) {
      return initialColumnVisibility;
    }

    // The initial preset seeds visibility, so it has to be resolved from the column definitions -
    // there is no table instance to read columns from yet.
    return initialPreset
      ? presetToVisibility(initialPreset, getConfigurableColumnIdsFromDefs(columns))
      : initialColumnVisibility ?? {};
  });
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
    tableSettings?.columnConfig?.initialColumnSizing ?? {}
  );
  const [hasRenderError, setHasRenderError] = useState(false);
  const [settingsRowHeight, setSettingsRowHeight] = useState<number>(DEFAULT_SETTINGS_ROW_HEIGHT);

  // Handler that ensures a minimum reasonable height
  const handleSettingsHeightChange = useCallback((height: number) => {
    setSettingsRowHeight(Math.max(height, MIN_SETTINGS_ROW_HEIGHT));
  }, []);

  const activePreset = useMemo(
    () => presets?.find((preset) => preset.id === activePresetId) ?? null,
    [presets, activePresetId]
  );

  // Configurable column ids derived from the column definitions, so preset comparisons do not
  // depend on the table instance existing yet
  const configurableColumnIds = useMemo(
    () => getConfigurableColumnIdsFromDefs(columns),
    [columns]
  );

  // True when the visible columns no longer match the applied preset
  const presetModified = useMemo(() => {
    return activePreset ? isPresetModified(activePreset, configurableColumnIds, columnVisibility) : false;
  }, [activePreset, configurableColumnIds, columnVisibility]);

  // Check if any table settings have been modified. With presets in play, "modified" means the
  // visible columns deviate from the applied preset rather than simply having hidden columns.
  const hasModifiedSettings = useMemo(() => {
    const hasHiddenColumns = Object.values(columnVisibility).some(visible => visible === false);

    if (presets?.length) {
      return activePreset ? presetModified : hasHiddenColumns;
    }

    return hasHiddenColumns;
  }, [columnVisibility, presets, activePreset, presetModified]);

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
    let processedColumns = [...columns];

    // Disable sorting on non-grouped columns when grouped rows is enabled
    if (groupedRows?.enabled && groupedRows.groupBy) {
      processedColumns = processedColumns.map(column => ({
        ...column,
        enableSorting: column.id === groupedRows.groupBy || (column as any).accessorKey === groupedRows.groupBy
      }));
    }

    if (moreActionsConfig) {
      return [
        ...processedColumns,
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
    return processedColumns;
  }, [columns, moreActionsConfig, groupedRows]);


  // Use the state and functions returned from useReactTable to build your UI
  const enableMultiSort = options.enableMultiSort ?? true;
  const table = useReactTable({
    data: data ?? [],
    columns: memoizedColumns,
    state: {
      sorting,
      expanded,
      columnVisibility,
      columnSizing
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    enableExpanding: true,
    getRowCanExpand: () => true,
    autoResetExpanded: true,
    enableMultiSort,
    columnResizeMode: 'onChange',
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

  // Column sizing change subscriber effect
  useEffect(() => {
    if (tableSettings?.columnConfig?.columnSizingChangeSubscriber) {
      tableSettings.columnConfig.columnSizingChangeSubscriber(columnSizing);
    }
  }, [columnSizing, tableSettings]);

  const presetChangeSubscriber = tableSettings?.columnConfig?.presetChangeSubscriber;

  // Column preset change subscriber effect. This depends on the callback itself rather than on
  // tableSettings so an inline tableSettings object does not re-fire it on every render.
  useEffect(() => {
    if (presetChangeSubscriber) {
      presetChangeSubscriber({
        presetId: activePresetId,
        isModified: presetModified,
        visibleColumnIds: getVisibleColumnIds(configurableColumnIds, columnVisibility),
        columnVisibility
      });
    }
  }, [presetChangeSubscriber, activePresetId, presetModified, configurableColumnIds, columnVisibility]);

  // Apply a preset, replacing the current column visibility with exactly the preset's columns
  const handleApplyPreset = useCallback((presetId: string) => {
    const preset = presets?.find(({ id }) => id === presetId);

    if (!preset) {
      return;
    }

    setActivePresetId(preset.id);
    setColumnVisibility(presetToVisibility(preset, getConfigurableColumnIds(table.getAllLeafColumns())));
  }, [presets, table]);

  // Restore the applied preset's columns, discarding any manual changes
  const handleRevertPreset = useCallback(() => {
    if (!activePreset) {
      return;
    }

    setColumnVisibility(presetToVisibility(activePreset, getConfigurableColumnIds(table.getAllLeafColumns())));
  }, [activePreset, table]);

  const onSavePreset = tableSettings?.columnConfig?.onSavePreset;

  // Hand the current columns off to the consumer to name and persist. When they respond with the new
  // preset's id, select it so the unsaved changes callout clears. A rejected save leaves the
  // selection alone - reporting the failure is the consumer's job.
  const handleSavePreset = useCallback(async (columnIds: string[], sourcePreset: TableColumnPreset | null) => {
    try {
      const savedPresetId = await onSavePreset?.(columnIds, sourcePreset);

      if (savedPresetId) {
        setActivePresetId(savedPresetId);
      }
    } catch {
      // Persisting a preset is the consumer's concern, and must never break the table
    }
  }, [onSavePreset]);

  const onUpdatePreset = tableSettings?.columnConfig?.onUpdatePreset;

  // Overwrite the applied preset. The consumer pushes the new columns back in through `presets`,
  // which is what clears the modified state - the visible columns are already what the user wants.
  const handleUpdatePreset = useCallback(async (presetId: string, columnIds: string[]) => {
    try {
      await onUpdatePreset?.(presetId, columnIds);
    } catch {
      // As above
    }
  }, [onUpdatePreset]);

  const onDeletePreset = tableSettings?.columnConfig?.onDeletePreset;

  // Deleting the applied preset drops the selection but leaves the columns on screen alone, so
  // nothing jumps under the user.
  const handleDeletePreset = useCallback(async (presetId: string) => {
    try {
      await onDeletePreset?.(presetId);

      setActivePresetId((previous) => (previous === presetId ? null : previous));
    } catch {
      // As above
    }
  }, [onDeletePreset]);

  // Handle table data download
  const handleDownload = () => {
    const rows = table.getRowModel().rows;
    const visibleColumns = table.getAllLeafColumns().filter(
      col => col.getIsVisible() && col.id !== 'more-actions'
    );

    const csv = convertToCSV(rows, visibleColumns);
    const filename = tableSettings?.downloadFilename || 'table-data.csv';
    downloadFile(csv, filename);
  };

  const tableComponent = (
    <TableStyle className={className} style={style}>
      <HideableTHead
        hide={hideHeaders}
        sticky={shouldUseStickyHeaders}
        hasSettings={Boolean(tableSettings) && shouldUseStickyHeaders}
      >
        {table.getHeaderGroups().map((headerGroup: any) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header: any, idx: number) => {
              const hasMoreActions = Boolean(moreActionsConfig);
              const isLast = isLastHeader(header, idx, headerGroup.headers.length, hasMoreActions);

              return (
                <HeaderCell
                  key={header.id}
                  style={{
                    width: header.getSize(),
                    position: 'relative'
                  }}
                  headerWidth={header.getSize()}
                  onMouseDown={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                  title={getTitleForMultiSort(
                    !enableMultiSort,
                    header.column.getCanSort() ? 'Toggle sorting' : '',
                    !header.column.getCanSort()
                  )}
                >
                  <StyledHeader className='header-content-wrapper'>
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
                  {header.column.getCanResize() && (
                    <ResizerContainer
                      onMouseDown={e => {
                        e.stopPropagation();
                        header.getResizeHandler()(e);
                      }}
                      onTouchStart={e => {
                        e.stopPropagation();
                        header.getResizeHandler()(e);
                      }}
                      className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                    >
                      <ColumnResizeHandle showHandle={!isLast}/>
                    </ResizerContainer>
                  )}
                </HeaderCell>
              );
            })}
          </tr>
        ))}
      </HideableTHead>
      <tbody>
      {!hasRenderError && table.getRowModel().rows.map((row: any) => {
        return (
          <TableRow
            key={row.id}
            row={row}
            rowProps={rowProps}
            renderRowSubComponent={renderRowSubComponent}
            contextMenuConfig={contextMenuConfig}
            moreActionsConfig={moreActionsConfig}
            onRenderError={() => setHasRenderError(true)}
            groupedRows={groupedRows}
          />
        );
      })}
      {hasRenderError && (
        <tr>
          <ErrorMessage colSpan={memoizedColumns.length}>{errorMessage}</ErrorMessage>
        </tr>
      )}
      {!hasRenderError && table.getRowModel().rows.length === 0 && (
        <tr>
          <td colSpan={memoizedColumns.length}>{noDataMessage}</td>
        </tr>
      )}
      {!hasRenderError && infiniteScroll && infiniteScroll.hasMore && (
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

  const displayTableSettings = tableSettings?.display ?? true;

  // Render table with settings panel
  return (
    <TableWrapper
      hasSettings={displayTableSettings}
      stickyHeaders={shouldUseStickyHeaders}
      settingsRowHeight={settingsRowHeight}
      {...wrapperProps}
    >
      {displayTableSettings && (
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
          activePresetId={activePresetId}
          presetModified={presetModified}
          onApplyPreset={handleApplyPreset}
          onRevertPreset={handleRevertPreset}
          onSavePreset={onSavePreset ? handleSavePreset : undefined}
          onUpdatePreset={onUpdatePreset ? handleUpdatePreset : undefined}
          onDeletePreset={onDeletePreset ? handleDeletePreset : undefined}
          stickyHeaders={shouldUseStickyHeaders}
          hasModifiedSettings={hasModifiedSettings}
          onDownload={tableSettings?.enableDownload ? handleDownload : undefined}
          buttonDisplayStyle={tableSettings?.buttonDisplayStyle}
          onHeightChange={handleSettingsHeightChange}
          overlayPosition={tableSettings?.buttonDisplayStyle === 'text' ? 'right' : undefined}
        />
      )}
      {tableComponent}
    </TableWrapper>
  );
};

export default Table;

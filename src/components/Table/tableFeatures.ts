import {
    columnResizingFeature,
    columnSizingFeature,
    columnVisibilityFeature,
    createExpandedRowModel,
    createSortedRowModel,
    metaHelper,
    rowExpandingFeature,
    rowSortingFeature,
    tableFeatures
} from '@tanstack/react-table';

/**
 * The shape of `columnDef.meta` on a column passed to this Table.
 *
 * Two deliberate looseness decisions. The index signature has to be here: without it the
 * `columnMeta` slot below narrows `meta` to exactly these keys, and every consumer column carrying
 * anything else becomes an excess-property error. And the row stays `any` because the feature set's
 * own type is what binds the row type, so naming it here would make that type depend on itself; a
 * loose row also keeps every existing consumer callback assignable, since react-table 9 made the
 * feature type argument invariant.
 */
export interface TableColumnMeta {
    /**
     * Resolves this column's csv export value, taking precedence over the cell renderer and the raw
     * value. See `resolveCsvCellValue`.
     */
    csvValue?: (value: any, row: any) => unknown;
    [key: string]: unknown;
}

/*
 * The feature modules this Table uses. react-table 9 makes features opt-in so unused ones tree-shake
 * out, which makes this list a contract: an instance method whose feature is missing here is a type
 * error rather than a runtime surprise. Registered one by one rather than through stockFeatures, so
 * filtering, pagination, row selection, grouping, ordering, pinning and faceting stay out of the
 * bundle. There is no core row model entry because the core model is always included.
 *
 * Kept at module scope on purpose: a fresh object per render would rebuild the table's prototypes
 * and instance data every render.
 */
export const lakefrontTableFeatures = tableFeatures({
    // sorting: the sortable headers, enableMultiSort, and per-column enableSorting
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    // row expansion: renderRowSubComponent and the expander cells consumers supply
    rowExpandingFeature,
    expandedRowModel: createExpandedRowModel(),
    // column visibility: the settings panel and the column presets
    columnVisibilityFeature,
    // column sizing: header.getSize(), columnDef.size, and the columnSizing state
    columnSizingFeature,
    // column resizing: the drag handle. Requires columnSizingFeature
    columnResizingFeature,
    /*
     * Type-only slot, stripped at runtime, declaring the shape of columnDef.meta for this Table
     * alone. Replaces declaration merging on ColumnMeta, which would have imposed this shape on
     * every unrelated react-table instance in a consuming application.
     */
    columnMeta: metaHelper<TableColumnMeta>()
});

export type LakefrontTableFeatures = typeof lakefrontTableFeatures;

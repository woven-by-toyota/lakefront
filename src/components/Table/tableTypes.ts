import type {
    Cell,
    CellContext,
    Column,
    ColumnDef,
    HeaderContext,
    Row,
    RowData,
    Table,
    TableOptions
} from '@tanstack/react-table';
import type { LakefrontTableFeatures } from './tableFeatures';

/*
 * react-table 9 makes TableFeatures the first type argument on nearly every table type, so a bare
 * ColumnDef<MyRow, any> no longer compiles. These aliases bind this library's feature set once, so a
 * consumer's column definitions, cell renderers and option objects need no feature argument: which
 * features are registered is this library's business, not theirs. Each alias keeps the parameter
 * order and the defaults its v8 counterpart had, so TableColumn<MyRow> and Partial<TableColumn<any>>
 * still mean what they used to.
 */

/** A column definition for this Table. Exported publicly as `TableColumn`. */
export type TableColumn<TData extends RowData = any, TValue = any> = ColumnDef<LakefrontTableFeatures, TData, TValue>;

/** The argument a `columnDef.cell` renderer receives. */
export type TableCellContext<TData extends RowData = any, TValue = any> = CellContext<
    LakefrontTableFeatures,
    TData,
    TValue
>;

/** The argument a `columnDef.header` or `columnDef.footer` renderer receives. */
export type TableHeaderContext<TData extends RowData = any, TValue = any> = HeaderContext<
    LakefrontTableFeatures,
    TData,
    TValue
>;

/** A row instance, as handed to `renderRowSubComponent`, the row menu and `onDownloadPress`. */
export type TableRowInstance<TData extends RowData = any> = Row<LakefrontTableFeatures, TData>;

/** A resolved column instance, as handed to `onDownloadPress` and `resolveCsvCellValue`. */
export type TableColumnInstance<TData extends RowData = any, TValue = any> = Column<
    LakefrontTableFeatures,
    TData,
    TValue
>;

/** A resolved cell instance. */
export type TableCellInstance<TData extends RowData = any, TValue = any> = Cell<LakefrontTableFeatures, TData, TValue>;

/** The table instance itself. Rarely needed by consumers; exported for escape hatches. */
export type TableInstance<TData extends RowData = any> = Table<LakefrontTableFeatures, TData>;

/** The options the `options` prop accepts, before `Partial`. */
export type TableInstanceOptions<TData extends RowData = any> = TableOptions<LakefrontTableFeatures, TData>;

/*
 * State slices are not feature-parameterised, so these pass straight through. react-table 9 renamed
 * VisibilityState to ColumnVisibilityState; the old name is kept as an alias so this library's prop
 * names and every consumer typing a visibility map stayed put.
 */
export type {
    ColumnSizingState,
    ColumnSort,
    ColumnVisibilityState,
    ColumnVisibilityState as VisibilityState,
    ExpandedState,
    RowData,
    SortingState
} from '@tanstack/react-table';
export type { TableColumnMeta } from './tableFeatures';

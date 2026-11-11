import Table, {
    type GroupedRowsConfig,
    type TableProps,
    type TableSettingsConfig,
    type TableSortByOptions
} from './Table';
import type { TableColumnPreset, TableColumnPresetState } from './tableColumnPresetUtil';
import { resolveCsvCellValue } from './tableDownloadUtils';
import { lakefrontTableFeatures } from './tableFeatures';
import type {
    ColumnSizingState,
    ColumnSort,
    ColumnVisibilityState,
    ExpandedState,
    SortingState,
    TableCellContext,
    TableCellInstance,
    TableColumn,
    TableColumnInstance,
    TableColumnMeta,
    TableHeaderContext,
    TableInstance,
    TableInstanceOptions,
    TableRowInstance,
    VisibilityState
} from './tableTypes';

export {
    type ColumnSizingState,
    type ColumnSort,
    type ColumnVisibilityState,
    type ExpandedState,
    type GroupedRowsConfig,
    /*
     * Exported as a value, not only a type: it is the only way a consumer that needs a raw
     * react-table type can name this library's feature set, which is what keeps the aliases below
     * extensible rather than a dead end.
     */
    lakefrontTableFeatures,
    resolveCsvCellValue,
    type SortingState,
    type TableCellContext,
    type TableCellInstance,
    type TableColumn,
    type TableColumnInstance,
    type TableColumnMeta,
    type TableColumnPreset,
    type TableColumnPresetState,
    type TableHeaderContext,
    type TableInstance,
    type TableInstanceOptions,
    type TableProps,
    type TableRowInstance,
    type TableSettingsConfig,
    type TableSortByOptions,
    type VisibilityState
};
export default Table;

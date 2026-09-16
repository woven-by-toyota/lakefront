import { Column, ColumnDef, VisibilityState } from '@tanstack/react-table';

/**
 * A named set of columns that can be applied to the table in one click.
 */
export interface TableColumnPreset {
  /**
   * Stable unique identifier for the preset.
   */
  id: string;
  /**
   * The name displayed in the column configuration list, e.g. "Operations".
   */
  label: string;
  /**
   * The ids of the columns that should be visible when this preset is applied.
   * Every other configurable column is hidden. Columns that cannot be hidden
   * (`enableHiding: false`) are always left visible.
   */
  columns: string[];
  /**
   * When true, the preset is rendered in a separate group below a divider.
   * Use this for layouts the user saved themselves.
   */
  userDefined?: boolean;
}

/**
 * The current column configuration, emitted whenever the applied preset or its
 * modified state changes.
 */
export interface TableColumnPresetState {
  /**
   * The id of the applied preset, or null when no preset is applied.
   */
  presetId: string | null;
  /**
   * True when the visible columns no longer match the applied preset.
   */
  isModified: boolean;
  /**
   * The ids of every configurable column that is currently visible.
   */
  visibleColumnIds: string[];
  /**
   * The full table visibility state.
   */
  columnVisibility: VisibilityState;
}

/**
 * The column id used by the generated more actions column, which is never configurable.
 */
export const MORE_ACTIONS_COLUMN_ID = 'more-actions';

/**
 * Returns the ids of the columns a user is allowed to show and hide. Columns without
 * an id or a header, the generated more actions column, and columns that opt out with
 * `enableHiding: false` are all excluded.
 */
export const getConfigurableColumns = <T,>(columns: Column<T, any>[]): Column<T, any>[] =>
  columns.filter((column) => {
    if (!column.id || !column.columnDef.header) {
      return false;
    }

    if (column.id === MORE_ACTIONS_COLUMN_ID) {
      return false;
    }

    return column.columnDef.enableHiding !== false;
  });

/**
 * Returns the ids of the columns a user is allowed to show and hide.
 */
export const getConfigurableColumnIds = <T,>(columns: Column<T, any>[]): string[] =>
  getConfigurableColumns(columns).map((column) => column.id);

/**
 * Derives configurable column ids straight from column definitions. Needed to seed the
 * initial visibility state, which happens before a table instance exists.
 */
export const getConfigurableColumnIdsFromDefs = <T,>(columns: ColumnDef<T, any>[]): string[] =>
  columns
    .map((columnDef) => {
      const id = columnDef.id ?? (columnDef as { accessorKey?: string }).accessorKey;

      if (!id || !columnDef.header || id === MORE_ACTIONS_COLUMN_ID) {
        return undefined;
      }

      return columnDef.enableHiding === false ? undefined : id;
    })
    .filter((id): id is string => Boolean(id));

/**
 * Builds the visibility state that shows exactly the preset's columns. Ids outside of
 * `configurableColumnIds` are left untouched so columns that cannot be hidden stay visible.
 */
export const presetToVisibility = (
  preset: TableColumnPreset,
  configurableColumnIds: string[]
): VisibilityState => {
  const presetColumns = new Set(preset.columns);

  return configurableColumnIds.reduce<VisibilityState>((visibility, columnId) => {
    visibility[columnId] = presetColumns.has(columnId);

    return visibility;
  }, {});
};

/**
 * True when the visible configurable columns differ from the preset's columns.
 */
export const isPresetModified = (
  preset: TableColumnPreset,
  configurableColumnIds: string[],
  columnVisibility: VisibilityState
): boolean => {
  const presetColumns = new Set(preset.columns);

  return configurableColumnIds.some(
    (columnId) => (columnVisibility[columnId] !== false) !== presetColumns.has(columnId)
  );
};

/**
 * The ids of the configurable columns that are currently visible.
 */
export const getVisibleColumnIds = (
  configurableColumnIds: string[],
  columnVisibility: VisibilityState
): string[] => configurableColumnIds.filter((columnId) => columnVisibility[columnId] !== false);

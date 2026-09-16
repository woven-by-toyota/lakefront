import { Column, ColumnDef } from '@tanstack/react-table';
import {
  getConfigurableColumnIds,
  getConfigurableColumnIdsFromDefs,
  getConfigurableColumns,
  getVisibleColumnIds,
  isPresetModified,
  MORE_ACTIONS_COLUMN_ID,
  presetToVisibility,
  TableColumnPreset
} from '../tableColumnPresetUtil';

interface TestRow {
  title: string;
}

const asColumn = (
  id: string,
  columnDef: { header?: unknown; enableHiding?: boolean } = { header: id.toUpperCase() }
): Column<TestRow, any> => ({ id, columnDef } as Column<TestRow, any>);

const columns: Column<TestRow, any>[] = [
  asColumn('title'),
  asColumn('value'),
  asColumn('percentage'),
  asColumn('locked', { header: 'LOCKED', enableHiding: false }),
  asColumn('expander', { header: '' }),
  asColumn(MORE_ACTIONS_COLUMN_ID, { header: 'ACTIONS' })
];

const preset: TableColumnPreset = { id: 'summary', label: 'Summary', columns: ['title', 'value'] };

describe('getConfigurableColumns', () => {
  it('keeps only columns that can be shown and hidden by the user', () => {
    expect(getConfigurableColumns(columns).map(({ id }) => id)).toEqual(['title', 'value', 'percentage']);
  });

  it('drops columns without a header', () => {
    expect(getConfigurableColumns([asColumn('nameless', {})]).map(({ id }) => id)).toEqual([]);
  });

  it('drops the more actions column', () => {
    expect(getConfigurableColumns([asColumn(MORE_ACTIONS_COLUMN_ID)]).map(({ id }) => id)).toEqual([]);
  });

  it('drops columns with enableHiding set to false', () => {
    expect(getConfigurableColumns([asColumn('locked', { header: 'LOCKED', enableHiding: false })])).toEqual([]);
  });
});

describe('getConfigurableColumnIds', () => {
  it('returns the configurable column ids in column order', () => {
    expect(getConfigurableColumnIds(columns)).toEqual(['title', 'value', 'percentage']);
  });
});

describe('getConfigurableColumnIdsFromDefs', () => {
  const columnDefs = [
    { header: 'TITLE', accessorKey: 'title' },
    { header: 'VALUE', accessorKey: 'value' },
    { header: 'LOCKED', accessorKey: 'locked', enableHiding: false },
    { header: '', id: 'expander' },
    { header: 'ACTIONS', id: MORE_ACTIONS_COLUMN_ID },
    { header: 'CUSTOM', id: 'custom' }
  ] as ColumnDef<TestRow, any>[];

  it('resolves ids from either id or accessorKey and applies the same filtering', () => {
    expect(getConfigurableColumnIdsFromDefs(columnDefs)).toEqual(['title', 'value', 'custom']);
  });

  it('returns an empty list for no columns', () => {
    expect(getConfigurableColumnIdsFromDefs([])).toEqual([]);
  });
});

describe('presetToVisibility', () => {
  it('shows the preset columns and hides every other configurable column', () => {
    expect(presetToVisibility(preset, ['title', 'value', 'percentage'])).toEqual({
      title: true,
      value: true,
      percentage: false
    });
  });

  it('never hides locked columns, since they are not configurable', () => {
    const visibility = presetToVisibility(preset, getConfigurableColumnIds(columns));

    expect(visibility).not.toHaveProperty('locked');
    expect(visibility).not.toHaveProperty(MORE_ACTIONS_COLUMN_ID);
  });

  it('ignores preset columns that are not configurable', () => {
    const lockedPreset: TableColumnPreset = { id: 'odd', label: 'Odd', columns: ['title', 'locked'] };

    expect(presetToVisibility(lockedPreset, ['title', 'value'])).toEqual({ title: true, value: false });
  });
});

describe('isPresetModified', () => {
  const configurableColumnIds = ['title', 'value', 'percentage'];

  it('returns false when the visible columns match the preset', () => {
    const visibility = presetToVisibility(preset, configurableColumnIds);

    expect(isPresetModified(preset, configurableColumnIds, visibility)).toBe(false);
  });

  it('returns true when a preset column has been hidden', () => {
    expect(
      isPresetModified(preset, configurableColumnIds, { title: true, value: false, percentage: false })
    ).toBe(true);
  });

  it('returns true when a column outside the preset has been shown', () => {
    expect(
      isPresetModified(preset, configurableColumnIds, { title: true, value: true, percentage: true })
    ).toBe(true);
  });

  it('treats a missing visibility entry as visible', () => {
    const allColumnsPreset: TableColumnPreset = { id: 'all', label: 'All', columns: configurableColumnIds };

    expect(isPresetModified(allColumnsPreset, configurableColumnIds, {})).toBe(false);
    expect(isPresetModified(preset, configurableColumnIds, {})).toBe(true);
  });
});

describe('getVisibleColumnIds', () => {
  it('returns the visible configurable columns in column order', () => {
    expect(getVisibleColumnIds(['title', 'value', 'percentage'], { value: false })).toEqual([
      'title',
      'percentage'
    ]);
  });

  it('returns every configurable column when nothing is hidden', () => {
    expect(getVisibleColumnIds(['title', 'value'], {})).toEqual(['title', 'value']);
  });
});

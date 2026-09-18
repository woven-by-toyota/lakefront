import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import { humanize } from 'src/lib/format.js';
import useTableColumnPresets from 'src/lib/hooks/useTableColumnPresets/useTableColumnPresets';
import Table, { TableSettingsConfig } from '../Table';
import { TableColumnPreset } from '../tableColumnPresetUtil';

const columns = [
  { header: 'TITLE', accessorKey: 'title', cell: ({ getValue }: any) => getValue() },
  { header: 'VALUE', accessorKey: 'value' },
  { header: 'PERCENTAGE', accessorKey: 'percentage' }
];

const customData = [
  { title: 'r2204_1_0', value: 24, percentage: 166.992 },
  { title: 'r2012_1_0', value: 3, percentage: 47.442 }
];

const SUMMARY_PRESET: TableColumnPreset = { id: 'summary', label: 'Summary', columns: ['title', 'value'] };
const EVERYTHING_PRESET: TableColumnPreset = {
  id: 'everything',
  label: 'Everything',
  columns: ['title', 'value', 'percentage']
};
const MY_LAYOUT_PRESET: TableColumnPreset = {
  id: 'my-layout',
  label: 'My Layout',
  columns: ['title'],
  userDefined: true
};

const presets = [SUMMARY_PRESET, EVERYTHING_PRESET];

// humanize keeps the settings panel labels ("Value") distinct from the column headers ("VALUE")
const renderTable = (columnConfig: Partial<NonNullable<TableSettingsConfig['columnConfig']>>) =>
  render(
    <Table
      columns={columns}
      data={customData}
      tableSettings={{
        columnConfig: { enableColumnHiding: false, columnLabelTransform: humanize, ...columnConfig }
      }}
    />
  );

const openSettings = () => {
  fireEvent.click(screen.getByLabelText('Table settings'));
};

const getHeaderTexts = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('thead th')).map((th) => th.textContent);

const getColumnCheckbox = (label: string) => {
  const labelSpan = screen.getAllByText(label).find((element) => element.tagName === 'SPAN') as Element;

  return (labelSpan.closest('label') as Element).querySelector('input[type="checkbox"]') as Element;
};

describe('<Table> column presets', () => {
  it('does not render the column configuration section when no presets are provided', () => {
    renderTable({ enableColumnHiding: true });
    openSettings();

    expect(screen.getByText('Columns')).toBeInTheDocument();
    expect(screen.queryByText('Column Configuration')).not.toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not render the column configuration section for an empty preset list', () => {
    renderTable({ enableColumnHiding: true, presets: [] });
    openSettings();

    expect(screen.queryByText('Column Configuration')).not.toBeInTheDocument();
  });

  it('renders a row per preset with its column count', () => {
    renderTable({ enableColumnHiding: true, presets });
    openSettings();

    expect(screen.getByText('Column Configuration')).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Summary');
    expect(options[0]).toHaveTextContent('2 cols');
    expect(options[1]).toHaveTextContent('Everything');
    expect(options[1]).toHaveTextContent('3 cols');
  });

  it('renders the column configuration section without the columns checkbox list', () => {
    renderTable({ presets });
    openSettings();

    expect(screen.getByText('Column Configuration')).toBeInTheDocument();
    expect(screen.queryByText('Columns')).not.toBeInTheDocument();
  });

  it('renders user defined presets after the built in ones', () => {
    renderTable({ enableColumnHiding: true, presets: [...presets, MY_LAYOUT_PRESET] });
    openSettings();

    const options = screen.getAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual([
      'Summary2 cols',
      'Everything3 cols',
      'My Layout1 cols'
    ]);
  });

  it('shows exactly the preset columns when a preset is applied', async () => {
    const { container } = renderTable({ enableColumnHiding: true, presets });
    openSettings();

    expect(getHeaderTexts(container)).toEqual(['TITLE', 'VALUE', 'PERCENTAGE']);

    fireEvent.click(screen.getByText('Summary'));

    await waitFor(() => {
      expect(getHeaderTexts(container)).toEqual(['TITLE', 'VALUE']);
    });

    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Summary');
  });

  it('restores hidden columns when a wider preset is applied', async () => {
    const { container } = renderTable({ enableColumnHiding: true, presets });
    openSettings();

    fireEvent.click(screen.getByText('Summary'));

    await waitFor(() => {
      expect(getHeaderTexts(container)).toEqual(['TITLE', 'VALUE']);
    });

    fireEvent.click(screen.getByText('Everything'));

    await waitFor(() => {
      expect(getHeaderTexts(container)).toEqual(['TITLE', 'VALUE', 'PERCENTAGE']);
    });
  });

  it('seeds column visibility from initialPresetId on mount', () => {
    const { container } = renderTable({ enableColumnHiding: true, presets, initialPresetId: 'summary' });

    expect(getHeaderTexts(container)).toEqual(['TITLE', 'VALUE']);

    openSettings();

    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Summary');
  });

  it('ignores an initialPresetId that does not match a preset', () => {
    const { container } = renderTable({ enableColumnHiding: true, presets, initialPresetId: 'nope' });

    expect(getHeaderTexts(container)).toEqual(['TITLE', 'VALUE', 'PERCENTAGE']);

    openSettings();

    expect(screen.queryByRole('option', { selected: true })).not.toBeInTheDocument();
  });

  it('flags the applied preset as modified when a column is toggled', async () => {
    renderTable({ enableColumnHiding: true, presets, initialPresetId: 'summary' });
    openSettings();

    expect(screen.queryByText('Modified')).not.toBeInTheDocument();
    expect(screen.queryByText(/unsaved changes/)).not.toBeInTheDocument();

    fireEvent.click(getColumnCheckbox('Percentage'));

    await waitFor(() => {
      expect(screen.getByText('Modified')).toBeInTheDocument();
    });

    // The count stays the preset's, not the number of visible columns
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('2 cols');
    expect(screen.getByText('Summary — unsaved changes')).toBeInTheDocument();
  });

  it('restores the preset columns when revert is clicked', async () => {
    const { container } = renderTable({ enableColumnHiding: true, presets, initialPresetId: 'summary' });
    openSettings();

    fireEvent.click(getColumnCheckbox('Value'));

    await waitFor(() => {
      expect(getHeaderTexts(container)).toEqual(['TITLE']);
    });

    fireEvent.click(screen.getByText('Revert'));

    await waitFor(() => {
      expect(getHeaderTexts(container)).toEqual(['TITLE', 'VALUE']);
    });

    expect(screen.queryByText('Modified')).not.toBeInTheDocument();
    expect(screen.queryByText(/unsaved changes/)).not.toBeInTheDocument();
  });

  it('does not render the save button when onSavePreset is omitted', async () => {
    renderTable({ enableColumnHiding: true, presets, initialPresetId: 'summary' });
    openSettings();

    fireEvent.click(getColumnCheckbox('Percentage'));

    await waitFor(() => {
      expect(screen.getByText('Revert')).toBeInTheDocument();
    });

    expect(screen.queryByText('Save New')).not.toBeInTheDocument();
  });

  it('calls onSavePreset with the visible column ids and the source preset', async () => {
    const onSavePreset = jest.fn();

    renderTable({ enableColumnHiding: true, presets, initialPresetId: 'summary', onSavePreset });
    openSettings();

    fireEvent.click(getColumnCheckbox('Value'));

    await waitFor(() => {
      expect(screen.getByText('Save New')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save New'));

    expect(onSavePreset).toHaveBeenCalledWith(['title'], SUMMARY_PRESET);
  });

  it('applies the preset id returned by onSavePreset', async () => {
    const savedPreset: TableColumnPreset = {
      id: 'saved',
      label: 'Saved',
      columns: ['title'],
      userDefined: true
    };

    renderTable({
      enableColumnHiding: true,
      presets: [...presets, savedPreset],
      initialPresetId: 'summary',
      onSavePreset: () => savedPreset.id
    });
    openSettings();

    fireEvent.click(getColumnCheckbox('Value'));

    await waitFor(() => {
      expect(screen.getByText('Save New')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save New'));

    // The new preset matches the visible columns, so it becomes selected and unmodified
    await waitFor(() => {
      expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Saved');
    });

    expect(screen.queryByText('Modified')).not.toBeInTheDocument();
    expect(screen.queryByText(/unsaved changes/)).not.toBeInTheDocument();
  });

  it('restores a modified preset from initialColumnVisibility when initialPresetModified is set', () => {
    const { container } = renderTable({
      enableColumnHiding: true,
      presets,
      initialPresetId: 'summary',
      initialPresetModified: true,
      initialColumnVisibility: { title: true, value: false, percentage: true }
    });

    // The saved columns win over the preset's own, and the preset stays selected and modified
    expect(getHeaderTexts(container)).toEqual(['TITLE', 'PERCENTAGE']);

    openSettings();

    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Summary');
    expect(screen.getByText('Modified')).toBeInTheDocument();
    expect(screen.getByText('Revert')).toBeInTheDocument();
  });

  it('falls back to the preset columns when it was modified but nothing was stored', () => {
    const { container } = renderTable({
      enableColumnHiding: true,
      presets,
      initialPresetId: 'summary',
      initialPresetModified: true
    });

    expect(getHeaderTexts(container)).toEqual(['TITLE', 'VALUE']);
  });

  it('does not render the overwrite button when onUpdatePreset is omitted', async () => {
    renderTable({ enableColumnHiding: true, presets: [...presets, MY_LAYOUT_PRESET], initialPresetId: 'my-layout' });
    openSettings();

    fireEvent.click(getColumnCheckbox('Value'));

    await waitFor(() => {
      expect(screen.getByText('Revert')).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
  });

  it('overwrites a user defined preset through onUpdatePreset', async () => {
    const onUpdatePreset = jest.fn();

    renderTable({
      enableColumnHiding: true,
      presets: [...presets, MY_LAYOUT_PRESET],
      initialPresetId: 'my-layout',
      onUpdatePreset
    });
    openSettings();

    fireEvent.click(getColumnCheckbox('Value'));

    const saveButton = await screen.findByRole('button', { name: 'Save' });
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);

    expect(onUpdatePreset).toHaveBeenCalledWith('my-layout', ['title', 'value']);
  });

  it('disables the overwrite button for a built in preset', async () => {
    renderTable({
      enableColumnHiding: true,
      presets,
      initialPresetId: 'summary',
      onUpdatePreset: jest.fn()
    });
    openSettings();

    fireEvent.click(getColumnCheckbox('Percentage'));

    const saveButton = await screen.findByRole('button', { name: 'Save' });
    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveAttribute('title', 'Summary is a built in preset and cannot be overwritten');
  });

  it('renders the delete control on user defined presets only', () => {
    renderTable({
      enableColumnHiding: true,
      presets: [...presets, MY_LAYOUT_PRESET],
      onDeletePreset: jest.fn()
    });
    openSettings();

    expect(screen.getByLabelText('Delete My Layout preset')).toBeInTheDocument();
    expect(screen.queryByLabelText('Delete Summary preset')).not.toBeInTheDocument();
  });

  it('renders the delete control visibly at rest', () => {
    renderTable({
      enableColumnHiding: true,
      presets: [...presets, MY_LAYOUT_PRESET],
      onDeletePreset: jest.fn()
    });
    openSettings();

    // Guards against revealing the control through an emotion component selector, which resolves to
    // ".undefined" in any build without @emotion/babel-plugin and leaves the button permanently hidden
    expect(getComputedStyle(screen.getByLabelText('Delete My Layout preset')).opacity).not.toBe('0');
  });

  it('does not render the delete control when onDeletePreset is omitted', () => {
    renderTable({ enableColumnHiding: true, presets: [...presets, MY_LAYOUT_PRESET] });
    openSettings();

    expect(screen.queryByLabelText('Delete My Layout preset')).not.toBeInTheDocument();
  });

  it('deletes without applying the preset, dropping the selection and leaving the columns alone', async () => {
    const onDeletePreset = jest.fn();

    const { container } = renderTable({
      enableColumnHiding: true,
      presets: [...presets, MY_LAYOUT_PRESET],
      initialPresetId: 'my-layout',
      onDeletePreset
    });
    openSettings();

    expect(getHeaderTexts(container)).toEqual(['TITLE']);

    fireEvent.click(screen.getByLabelText('Delete My Layout preset'));

    expect(onDeletePreset).toHaveBeenCalledWith('my-layout');

    await waitFor(() => {
      expect(screen.queryByRole('option', { selected: true })).not.toBeInTheDocument();
    });

    // Nothing should jump under the user - the columns are still the deleted preset's
    expect(getHeaderTexts(container)).toEqual(['TITLE']);
  });

  it('normalizes a dotted accessorKey when seeding visibility from a preset', () => {
    const { container } = render(
      <Table
        columns={[
          { header: 'TITLE', accessorKey: 'title' },
          { header: 'BASE', accessorKey: 'base.name' }
        ]}
        data={[{ title: 'r2204_1_0', base: { name: 'Palo Alto' } }]}
        tableSettings={{
          columnConfig: {
            enableColumnHiding: true,
            presets: [{ id: 'title-only', label: 'Title Only', columns: ['title'] }],
            initialPresetId: 'title-only'
          }
        }}
      />
    );

    expect(getHeaderTexts(container)).toEqual(['TITLE']);
  });

  it('notifies presetChangeSubscriber when a preset is applied and modified', async () => {
    const presetChangeSubscriber = jest.fn();

    renderTable({ enableColumnHiding: true, presets, presetChangeSubscriber });

    expect(presetChangeSubscriber).toHaveBeenLastCalledWith({
      presetId: null,
      isModified: false,
      visibleColumnIds: ['title', 'value', 'percentage'],
      columnVisibility: {}
    });

    openSettings();
    fireEvent.click(screen.getByText('Summary'));

    await waitFor(() => {
      expect(presetChangeSubscriber).toHaveBeenLastCalledWith({
        presetId: 'summary',
        isModified: false,
        visibleColumnIds: ['title', 'value'],
        columnVisibility: { title: true, value: true, percentage: false }
      });
    });

    fireEvent.click(getColumnCheckbox('Percentage'));

    await waitFor(() => {
      expect(presetChangeSubscriber).toHaveBeenLastCalledWith({
        presetId: 'summary',
        isModified: true,
        visibleColumnIds: ['title', 'value', 'percentage'],
        columnVisibility: { title: true, value: true, percentage: true }
      });
    });
  });

  // The settings button glows while settings are modified. An applied preset always hides columns,
  // so "any column hidden" would leave the button glowing forever once a preset is used.
  const settingsButtonGlows = (container: HTMLElement) => {
    const settingsButton = container.querySelector('button.settings-icon') as HTMLElement;

    return getComputedStyle(settingsButton).animation !== '';
  };

  it('glows the settings button only while the columns deviate from the applied preset', async () => {
    const { container } = renderTable({ enableColumnHiding: true, presets, initialPresetId: 'summary' });

    expect(settingsButtonGlows(container)).toBe(false);

    openSettings();
    fireEvent.click(getColumnCheckbox('Percentage'));

    await waitFor(() => {
      expect(screen.getByText('Modified')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Revert'));

    await waitFor(() => {
      expect(screen.queryByText('Modified')).not.toBeInTheDocument();
    });

    expect(settingsButtonGlows(container)).toBe(false);
  });

  it('glows the settings button when columns are hidden without any preset applied', async () => {
    const { container } = renderTable({ enableColumnHiding: true, presets });

    expect(settingsButtonGlows(container)).toBe(false);

    openSettings();
    fireEvent.click(getColumnCheckbox('Percentage'));

    await waitFor(() => {
      expect(getHeaderTexts(container)).toEqual(['TITLE', 'VALUE']);
    });

    expect(settingsButtonGlows(container)).toBe(true);
  });

  // Building the column definitions inline is ordinary consumer code, and the preset change effect
  // depends on the ids derived from them, so this used to feed itself until React gave up
  it('does not loop when the columns array is rebuilt on every render', async () => {
    const PresetTable = () => {
      const { presets: mergedPresets, presetChangeSubscriber, initialPresetId } = useTableColumnPresets({
        presets,
        storage: { load: () => ({ presetId: 'summary', columnVisibility: {} }), save: () => undefined },
        persistColumnVisibility: false
      });

      return (
        <Table
          columns={columns.map((column) => ({ ...column }))}
          data={customData}
          tableSettings={{
            columnConfig: {
              enableColumnHiding: true,
              columnLabelTransform: humanize,
              presets: mergedPresets,
              initialPresetId,
              presetChangeSubscriber
            }
          }}
        />
      );
    };

    const { container } = render(<PresetTable />);

    await waitFor(() => {
      expect(getHeaderTexts(container)).toEqual(['TITLE', 'VALUE']);
    });

    openSettings();
    fireEvent.click(getColumnCheckbox('Percentage'));

    await waitFor(() => {
      expect(screen.getByText('Modified')).toBeInTheDocument();
    });
  });
});

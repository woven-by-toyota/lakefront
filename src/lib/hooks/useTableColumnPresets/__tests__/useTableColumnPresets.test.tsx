import { act, renderHook, waitFor } from '@testing-library/react';
import { TableColumnPreset } from 'src/components/Table/tableColumnPresetUtil';
import useTableColumnPresets, { TableColumnPreferences, TableColumnPreferencesStorage } from '../useTableColumnPresets';
import createLocalStorageColumnPreferences from '../localStorageColumnPreferences';

const SUMMARY_PRESET: TableColumnPreset = { id: 'summary', label: 'Summary', columns: ['title', 'value'] };
const EVERYTHING_PRESET: TableColumnPreset = {
  id: 'everything',
  label: 'Everything',
  columns: ['title', 'value', 'percentage']
};

const presets = [SUMMARY_PRESET, EVERYTHING_PRESET];

const createStorage = (
  loaded: TableColumnPreferences | null = null
): TableColumnPreferencesStorage & { save: jest.Mock } => ({
  load: jest.fn().mockResolvedValue(loaded),
  save: jest.fn()
});

describe('useTableColumnPresets', () => {
  it('is ready immediately when no storage is provided', () => {
    const { result } = renderHook(() => useTableColumnPresets({ presets }));

    expect(result.current.ready).toBe(true);
    expect(result.current.presets).toEqual(presets);
    expect(result.current.preferences).toBeNull();
  });

  it('falls back to defaultPresetId when storage has nothing saved', async () => {
    const storage = createStorage(null);
    const { result } = renderHook(() =>
      useTableColumnPresets({ presets, storage, defaultPresetId: 'summary' })
    );

    expect(result.current.ready).toBe(false);

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    expect(result.current.initialPresetId).toBe('summary');
    expect(result.current.initialColumnVisibility).toBeUndefined();
  });

  it('gates on ready and seeds the initial props from stored preferences', async () => {
    const storage = createStorage({
      presetId: 'everything',
      columnVisibility: { title: true, value: true, percentage: true }
    });

    const { result } = renderHook(() =>
      useTableColumnPresets({ presets, storage, defaultPresetId: 'summary' })
    );

    expect(result.current.ready).toBe(false);

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    expect(result.current.initialPresetId).toBe('everything');
    expect(result.current.initialColumnVisibility).toEqual({ title: true, value: true, percentage: true });
  });

  it('does not reinstate the default preset when the user intentionally has none applied', async () => {
    const storage = createStorage({ presetId: null, columnVisibility: { percentage: false } });
    const { result } = renderHook(() =>
      useTableColumnPresets({ presets, storage, defaultPresetId: 'summary' })
    );

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    expect(result.current.initialPresetId).toBeUndefined();
  });

  it('stays ready when loading throws', async () => {
    const storage: TableColumnPreferencesStorage = {
      load: jest.fn().mockRejectedValue(new Error('offline')),
      save: jest.fn()
    };

    const { result } = renderHook(() => useTableColumnPresets({ presets, storage }));

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    expect(result.current.preferences).toBeNull();
  });

  it('merges stored user presets after the provided ones and marks them userDefined', async () => {
    const storage = createStorage({
      presetId: 'my-layout',
      columnVisibility: {},
      userPresets: [{ id: 'my-layout', label: 'My Layout', columns: ['title'] }]
    });

    const { result } = renderHook(() => useTableColumnPresets({ presets, storage }));

    await waitFor(() => {
      expect(result.current.presets).toHaveLength(3);
    });

    expect(result.current.presets[2]).toEqual({
      id: 'my-layout',
      label: 'My Layout',
      columns: ['title'],
      userDefined: true
    });
  });

  it('does not duplicate a stored preset that is also provided', async () => {
    const storage = createStorage({
      presetId: 'summary',
      columnVisibility: {},
      userPresets: [SUMMARY_PRESET]
    });

    const { result } = renderHook(() => useTableColumnPresets({ presets, storage }));

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    expect(result.current.presets).toEqual(presets);
  });

  it('debounces saves and does not re-save what it just loaded', async () => {
    jest.useFakeTimers();

    const loaded = { presetId: 'summary', columnVisibility: { percentage: false } };
    const storage = createStorage(loaded);
    const { result } = renderHook(() =>
      useTableColumnPresets({ presets, storage, saveDebounceMs: 300 })
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.ready).toBe(true);

    // Loading alone must not write back
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(storage.save).not.toHaveBeenCalled();

    act(() => {
      result.current.presetChangeSubscriber({
        presetId: 'everything',
        isModified: false,
        visibleColumnIds: ['title', 'value', 'percentage'],
        columnVisibility: { title: true, value: true, percentage: true }
      });
    });

    // Still inside the debounce window
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(storage.save).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(storage.save).toHaveBeenCalledTimes(1);
    expect(storage.save).toHaveBeenCalledWith({
      presetId: 'everything',
      columnVisibility: { title: true, value: true, percentage: true }
    });

    jest.useRealTimers();
  });

  it('does not expose onSavePreset unless createPreset is provided', () => {
    const { result } = renderHook(() => useTableColumnPresets({ presets }));

    expect(result.current.onSavePreset).toBeUndefined();
  });

  it('persists a created preset, selects it, and ignores a cancelled save', async () => {
    const storage = createStorage(null);
    const createPreset = jest
      .fn()
      .mockReturnValueOnce(null)
      .mockReturnValueOnce({ id: 'my-layout', label: 'My Layout', columns: ['title'] });

    const { result } = renderHook(() => useTableColumnPresets({ presets, storage, createPreset }));

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    await act(async () => {
      const savedId = await result.current.onSavePreset?.(['title'], SUMMARY_PRESET);
      expect(savedId).toBeUndefined();
    });

    expect(result.current.presets).toEqual(presets);

    await act(async () => {
      const savedId = await result.current.onSavePreset?.(['title'], SUMMARY_PRESET);
      expect(savedId).toBe('my-layout');
    });

    expect(createPreset).toHaveBeenLastCalledWith(['title'], SUMMARY_PRESET);
    expect(result.current.presets[2]).toEqual({
      id: 'my-layout',
      label: 'My Layout',
      columns: ['title'],
      userDefined: true
    });
    expect(result.current.preferences?.presetId).toBe('my-layout');

    await waitFor(() => {
      expect(storage.save).toHaveBeenCalled();
    });
  });
});

describe('createLocalStorageColumnPreferences', () => {
  const key = 'lakefront-test-column-preferences';

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('round trips preferences', () => {
    const storage = createLocalStorageColumnPreferences(key);
    const preferences: TableColumnPreferences = {
      presetId: 'summary',
      columnVisibility: { percentage: false },
      userPresets: [{ id: 'my-layout', label: 'My Layout', columns: ['title'] }]
    };

    storage.save(preferences);

    expect(storage.load()).toEqual(preferences);
  });

  it('returns null when nothing is stored', () => {
    expect(createLocalStorageColumnPreferences(key).load()).toBeNull();
  });

  it('returns null for unparseable stored values', () => {
    window.localStorage.setItem(key, 'not json');

    expect(createLocalStorageColumnPreferences(key).load()).toBeNull();
  });

  it('does not throw when storage is unavailable', () => {
    const setItem = jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    expect(() => createLocalStorageColumnPreferences(key).save({ presetId: null, columnVisibility: {} }))
      .not.toThrow();

    setItem.mockRestore();
  });

  it('loads what the hook saves', async () => {
    const storage = createLocalStorageColumnPreferences(key);
    const { result } = renderHook(() => useTableColumnPresets({ presets, storage, saveDebounceMs: 0 }));

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    act(() => {
      result.current.presetChangeSubscriber({
        presetId: 'summary',
        isModified: false,
        visibleColumnIds: ['title', 'value'],
        columnVisibility: { title: true, value: true, percentage: false }
      });
    });

    await waitFor(() => {
      expect(storage.load()).toEqual({
        presetId: 'summary',
        columnVisibility: { title: true, value: true, percentage: false }
      });
    });
  });
});

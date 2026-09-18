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
      isModified: false,
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

  it('is ready on the first render when load is synchronous', () => {
    const loaded = { presetId: 'everything', columnVisibility: { percentage: true }, isModified: true };
    const { result } = renderHook(() =>
      useTableColumnPresets({ presets, storage: { load: () => loaded, save: jest.fn() } })
    );

    expect(result.current.ready).toBe(true);
    expect(result.current.initialPresetId).toBe('everything');
    expect(result.current.initialPresetModified).toBe(true);
    expect(result.current.initialColumnVisibility).toEqual({ percentage: true });
  });

  it('reports a synchronous load failure and stays ready', () => {
    const onError = jest.fn();
    const error = new Error('offline');
    const { result } = renderHook(() =>
      useTableColumnPresets({
        presets,
        storage: { load: () => { throw error; }, save: jest.fn() },
        onError
      })
    );

    expect(result.current.ready).toBe(true);
    expect(onError).toHaveBeenCalledWith(error, 'load');
  });

  it('persists isModified so an unsaved modification survives a reload', async () => {
    const storage = createStorage(null);
    const { result } = renderHook(() => useTableColumnPresets({ presets, storage, saveDebounceMs: 0 }));

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    act(() => {
      result.current.presetChangeSubscriber({
        presetId: 'summary',
        isModified: true,
        visibleColumnIds: ['title'],
        columnVisibility: { title: true, value: false, percentage: false }
      });
    });

    await waitFor(() => {
      expect(storage.save).toHaveBeenCalledWith({
        presetId: 'summary',
        isModified: true,
        columnVisibility: { title: true, value: false, percentage: false }
      });
    });

    // What was saved above, re-read on the next page load
    const reloaded = renderHook(() =>
      useTableColumnPresets({
        presets,
        storage: { load: () => storage.save.mock.calls[0][0], save: jest.fn() }
      })
    );

    expect(reloaded.result.current.initialPresetId).toBe('summary');
    expect(reloaded.result.current.initialPresetModified).toBe(true);
  });

  it('leaves column visibility out of the saved preferences when persistColumnVisibility is false', async () => {
    const storage = createStorage(null);
    const { result } = renderHook(() =>
      useTableColumnPresets({ presets, storage, saveDebounceMs: 0, persistColumnVisibility: false })
    );

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
      expect(storage.save).toHaveBeenCalledTimes(1);
    });
    expect(storage.save).toHaveBeenCalledWith({ presetId: 'summary', isModified: false, columnVisibility: {} });

    // Hiding another column changes nothing worth writing
    act(() => {
      result.current.presetChangeSubscriber({
        presetId: 'summary',
        isModified: false,
        visibleColumnIds: ['title'],
        columnVisibility: { title: true, value: false, percentage: false }
      });
    });

    await act(async () => {
      await Promise.resolve();
    });
    expect(storage.save).toHaveBeenCalledTimes(1);
  });

  it('keeps the same state when an equivalent preset change comes back round', async () => {
    const storage = createStorage(null);
    const { result } = renderHook(() => useTableColumnPresets({ presets, storage, saveDebounceMs: 0 }));

    const presetState = {
      presetId: 'summary',
      isModified: false,
      visibleColumnIds: ['title', 'value'],
      columnVisibility: { title: true, value: true, percentage: false }
    };

    act(() => {
      result.current.presetChangeSubscriber(presetState);
    });

    await waitFor(() => {
      expect(result.current.preferences?.presetId).toBe('summary');
    });

    const { preferences } = result.current;

    // A Table that rebuilds its columns every render re-fires this with equal but not identical state.
    // Handing back the same object is what stops that becoming a render loop.
    act(() => {
      result.current.presetChangeSubscriber({
        ...presetState,
        visibleColumnIds: ['title', 'value'],
        columnVisibility: { title: true, value: true, percentage: false }
      });
    });

    expect(result.current.preferences).toBe(preferences);
    expect(storage.save).toHaveBeenCalledTimes(1);
  });

  it('reports a rejected save', async () => {
    const onError = jest.fn();
    const error = new Error('too long');
    const storage = { load: () => null, save: jest.fn().mockRejectedValue(error) };
    const { result } = renderHook(() =>
      useTableColumnPresets({ presets, storage, saveDebounceMs: 0, onError })
    );

    act(() => {
      result.current.presetChangeSubscriber({
        presetId: 'summary',
        isModified: false,
        visibleColumnIds: ['title', 'value'],
        columnVisibility: {}
      });
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error, 'save');
    });
  });

  it('reports a rejected createPreset without selecting anything', async () => {
    const onError = jest.fn();
    const error = new Error('duplicate name');
    const createPreset = jest.fn().mockRejectedValue(error);
    const { result } = renderHook(() =>
      useTableColumnPresets({ presets, storage: createStorage(null), createPreset, onError })
    );

    await act(async () => {
      const savedId = await result.current.onSavePreset?.(['title'], SUMMARY_PRESET);
      expect(savedId).toBeUndefined();
    });

    expect(onError).toHaveBeenCalledWith(error, 'createPreset');
    expect(result.current.presets).toEqual(presets);
  });

  it('does not expose onUpdatePreset or onDeletePreset unless their callbacks are provided', () => {
    const { result } = renderHook(() => useTableColumnPresets({ presets }));

    expect(result.current.onUpdatePreset).toBeUndefined();
    expect(result.current.onDeletePreset).toBeUndefined();
  });

  it('overwrites a user preset in place rather than adding one', async () => {
    const updatePreset = jest.fn();
    const storage = {
      load: () => ({
        presetId: 'my-layout',
        columnVisibility: {},
        userPresets: [{ id: 'my-layout', label: 'My Layout', columns: ['title'] }]
      }),
      save: jest.fn()
    };

    const { result } = renderHook(() =>
      useTableColumnPresets({ presets, storage, saveDebounceMs: 0, updatePreset })
    );

    await act(async () => {
      await result.current.onUpdatePreset?.('my-layout', ['title', 'percentage']);
    });

    expect(updatePreset).toHaveBeenCalledWith({
      id: 'my-layout',
      label: 'My Layout',
      columns: ['title', 'percentage'],
      userDefined: true
    });
    expect(result.current.presets).toHaveLength(3);
    expect(result.current.presets[2].columns).toEqual(['title', 'percentage']);
    expect(result.current.preferences?.isModified).toBe(false);
  });

  it('keeps the preset as it was when the overwrite is rejected', async () => {
    const onError = jest.fn();
    const error = new Error('too long');
    const storage = {
      load: () => ({
        presetId: 'my-layout',
        columnVisibility: {},
        userPresets: [{ id: 'my-layout', label: 'My Layout', columns: ['title'] }]
      }),
      save: jest.fn()
    };

    const { result } = renderHook(() =>
      useTableColumnPresets({
        presets,
        storage,
        saveDebounceMs: 0,
        updatePreset: jest.fn().mockRejectedValue(error),
        onError
      })
    );

    await act(async () => {
      await result.current.onUpdatePreset?.('my-layout', ['title', 'percentage']);
    });

    expect(onError).toHaveBeenCalledWith(error, 'updatePreset');
    expect(result.current.presets[2].columns).toEqual(['title']);
  });

  it('removes a deleted preset and clears the selection when it was applied', async () => {
    const deletePreset = jest.fn();
    const storage = {
      load: () => ({
        presetId: 'my-layout',
        columnVisibility: { percentage: false },
        userPresets: [{ id: 'my-layout', label: 'My Layout', columns: ['title'] }]
      }),
      save: jest.fn()
    };

    const { result } = renderHook(() =>
      useTableColumnPresets({ presets, storage, saveDebounceMs: 0, deletePreset })
    );

    await act(async () => {
      await result.current.onDeletePreset?.('my-layout');
    });

    expect(deletePreset).toHaveBeenCalledWith({ id: 'my-layout', label: 'My Layout', columns: ['title'] });
    expect(result.current.presets).toEqual(presets);
    expect(result.current.preferences?.presetId).toBeNull();
    // Deleting a preset must not disturb the columns on screen
    expect(result.current.preferences?.columnVisibility).toEqual({ percentage: false });
  });

  it('keeps a deleted preset when the delete is rejected', async () => {
    const onError = jest.fn();
    const error = new Error('offline');
    const storage = {
      load: () => ({
        presetId: 'summary',
        columnVisibility: {},
        userPresets: [{ id: 'my-layout', label: 'My Layout', columns: ['title'] }]
      }),
      save: jest.fn()
    };

    const { result } = renderHook(() =>
      useTableColumnPresets({
        presets,
        storage,
        saveDebounceMs: 0,
        deletePreset: jest.fn().mockRejectedValue(error),
        onError
      })
    );

    await act(async () => {
      await result.current.onDeletePreset?.('my-layout');
    });

    expect(onError).toHaveBeenCalledWith(error, 'deletePreset');
    expect(result.current.presets).toHaveLength(3);
    expect(result.current.preferences?.presetId).toBe('summary');
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
        isModified: false,
        columnVisibility: { title: true, value: true, percentage: false }
      });
    });
  });
});

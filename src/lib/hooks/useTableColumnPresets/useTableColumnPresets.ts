import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VisibilityState } from '@tanstack/react-table';
import { TableColumnPreset, TableColumnPresetState } from 'src/components/Table/tableColumnPresetUtil';
import useDebounce from 'src/lib/hooks/useDebounce';

/**
 * The persisted shape of a user's table column configuration.
 */
export interface TableColumnPreferences {
  /**
   * The id of the applied preset, or null when none is applied.
   */
  presetId: string | null;
  /**
   * The table column visibility state.
   */
  columnVisibility: VisibilityState;
  /**
   * True when the saved columns deviate from the applied preset. Persisting this is what lets an
   * unsaved modification survive a page load with the preset still selected.
   */
  isModified?: boolean;
  /**
   * Layouts the user saved themselves. These are merged into the preset list and rendered in the
   * separated group below the divider.
   */
  userPresets?: TableColumnPreset[];
}

/**
 * The operations that can fail, reported through `onError`.
 */
export type TableColumnPreferencesOperation = 'load' | 'save' | 'createPreset' | 'updatePreset' | 'deletePreset';

/**
 * A storage adapter. Implement this against your own user preferences API - both methods may be
 * synchronous or return a promise. A synchronous `load` is applied on the first render, so `ready`
 * is true immediately and the table does not have to wait a commit to mount.
 */
export interface TableColumnPreferencesStorage {
  load(): Promise<TableColumnPreferences | null> | TableColumnPreferences | null;
  save(preferences: TableColumnPreferences): Promise<void> | void;
}

export interface UseTableColumnPresetsProps {
  /**
   * The presets your application provides. Presets loaded from storage are appended to these.
   */
  presets?: TableColumnPreset[];
  /**
   * Where to load and save the user's column configuration. When omitted, the hook keeps the
   * configuration in memory for the lifetime of the component.
   */
  storage?: TableColumnPreferencesStorage;
  /**
   * The preset to apply when storage has nothing saved yet.
   */
  defaultPresetId?: string;
  /**
   * How long to wait after the last change before saving. Defaults to 500ms.
   */
  saveDebounceMs?: number;
  /**
   * Whether the column visibility state is persisted. Defaults to true. Set this to false when your
   * storage cannot hold a visibility map, or when you already persist visibility elsewhere - only
   * the applied preset, its modified state and the user's presets are then saved, so showing and
   * hiding columns no longer triggers a write.
   */
  persistColumnVisibility?: boolean;
  /**
   * Turns on the "Save New" button. Return the preset to save (prompt the user for a name here), or
   * null to cancel. The returned preset is persisted as a user defined preset.
   */
  createPreset?: (
    columnIds: string[],
    sourcePreset: TableColumnPreset | null
  ) => TableColumnPreset | null | Promise<TableColumnPreset | null>;
  /**
   * Turns on the "Save" button, which overwrites a user defined preset's columns in place. Throw or
   * reject to leave the preset as it was.
   */
  updatePreset?: (preset: TableColumnPreset) => void | Promise<void>;
  /**
   * Turns on the delete control on user defined preset rows. Confirm the deletion here - lakefront
   * does not prompt. Throw or reject to keep the preset.
   */
  deletePreset?: (preset: TableColumnPreset) => void | Promise<void>;
  /**
   * Called whenever an operation fails. Loading and saving are best effort by default and stay that
   * way - this only reports, so surface what matters to your users.
   */
  onError?: (error: unknown, operation: TableColumnPreferencesOperation) => void;
}

export interface UseTableColumnPresetsResult {
  /**
   * False until the stored configuration has been loaded. Because the table's initialPresetId and
   * initialColumnVisibility props only seed state on mount, do not render the table until this
   * is true: `{ready && <Table … />}`. A synchronous `load` makes it true on the first render.
   */
  ready: boolean;
  /**
   * The last configuration the hook saved (or loaded), for display or debugging.
   */
  preferences: TableColumnPreferences | null;
  presets: TableColumnPreset[];
  initialPresetId?: string;
  initialPresetModified?: boolean;
  initialColumnVisibility?: VisibilityState;
  presetChangeSubscriber: (presetState: TableColumnPresetState) => void;
  onSavePreset?: (columnIds: string[], sourcePreset: TableColumnPreset | null) => Promise<string | void>;
  onUpdatePreset?: (presetId: string, columnIds: string[]) => Promise<void>;
  onDeletePreset?: (presetId: string) => Promise<void>;
}

/**
 * Wires a Table's column presets to a storage adapter of your choosing, so a user's column
 * configuration survives a page load. Spread the result into `tableSettings.columnConfig`.
 *
 * lakefront deliberately does not know how to talk to your API - implement `storage` with your own
 * `load`/`save` calls, or use `createLocalStorageColumnPreferences` for browser storage.
 *
 * Note that only the `storage` adapter passed on the first render is used to load, so an inline
 * object is safe.
 */
const useTableColumnPresets = ({
  presets = [],
  storage,
  defaultPresetId,
  saveDebounceMs = 500,
  persistColumnVisibility = true,
  createPreset,
  updatePreset,
  deletePreset,
  onError
}: UseTableColumnPresetsProps): UseTableColumnPresetsResult => {
  // Held in refs so re-created inline adapters and callbacks do not re-trigger the effects below
  const storageRef = useRef(storage);
  storageRef.current = storage;

  const createPresetRef = useRef(createPreset);
  createPresetRef.current = createPreset;

  const updatePresetRef = useRef(updatePreset);
  updatePresetRef.current = updatePreset;

  const deletePresetRef = useRef(deletePreset);
  deletePresetRef.current = deletePreset;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const lastSavedRef = useRef<string | null>(null);

  const reportError = useCallback((error: unknown, operation: TableColumnPreferencesOperation) => {
    onErrorRef.current?.(error, operation);
  }, []);

  // A synchronous load is applied here so the table can mount on the first render. Anything
  // asynchronous is left to the effect below.
  const [initialLoad] = useState<TableColumnPreferences | null | Promise<TableColumnPreferences | null>>(() => {
    if (!storageRef.current) {
      return null;
    }

    try {
      const loaded = storageRef.current.load();

      if (loaded && typeof (loaded as Promise<unknown>).then === 'function') {
        return loaded;
      }

      lastSavedRef.current = loaded ? JSON.stringify(loaded) : null;

      return loaded as TableColumnPreferences | null;
    } catch (error) {
      reportError(error, 'load');

      return null;
    }
  });

  const loadIsPending = Boolean(initialLoad && typeof (initialLoad as Promise<unknown>).then === 'function');

  const [ready, setReady] = useState(!loadIsPending);
  const [preferences, setPreferences] = useState<TableColumnPreferences | null>(
    loadIsPending ? null : (initialLoad as TableColumnPreferences | null)
  );

  // What was loaded, assigned once and never updated, so the initial* values handed to the table
  // are not re-derived from the user's later changes
  const [loadedPreferences, setLoadedPreferences] = useState<TableColumnPreferences | null>(
    loadIsPending ? null : (initialLoad as TableColumnPreferences | null)
  );

  const preferencesRef = useRef(preferences);
  preferencesRef.current = preferences;

  useEffect(() => {
    if (!loadIsPending) {
      return;
    }

    let cancelled = false;

    const finish = (loaded: TableColumnPreferences | null) => {
      if (cancelled) {
        return;
      }

      if (loaded) {
        setPreferences(loaded);
        setLoadedPreferences(loaded);
        lastSavedRef.current = JSON.stringify(loaded);
      }

      setReady(true);
    };

    Promise.resolve(initialLoad)
      .then(finish)
      .catch((error) => {
        reportError(error, 'load');
        finish(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Debounce on the serialized value so equivalent updates do not queue a save
  const serializedPreferences = preferences ? JSON.stringify(preferences) : null;
  const debouncedPreferences = useDebounce(serializedPreferences, saveDebounceMs);

  useEffect(() => {
    if (!ready || !debouncedPreferences || debouncedPreferences === lastSavedRef.current) {
      return;
    }

    lastSavedRef.current = debouncedPreferences;

    Promise.resolve(storageRef.current?.save(JSON.parse(debouncedPreferences))).catch((error) => {
      // Saving preferences is best effort - a failure should never break the table
      lastSavedRef.current = null;
      reportError(error, 'save');
    });
  }, [ready, debouncedPreferences]);

  const presetChangeSubscriber = useCallback((presetState: TableColumnPresetState) => {
    setPreferences((previous) => ({
      ...previous,
      presetId: presetState.presetId,
      isModified: presetState.isModified,
      columnVisibility: persistColumnVisibility ? presetState.columnVisibility : (previous?.columnVisibility ?? {})
    }));
  }, [persistColumnVisibility]);

  const handleSavePreset = useCallback(
    async (columnIds: string[], sourcePreset: TableColumnPreset | null) => {
      let created: TableColumnPreset | null | undefined;

      try {
        created = await createPresetRef.current?.(columnIds, sourcePreset);
      } catch (error) {
        reportError(error, 'createPreset');

        return;
      }

      if (!created) {
        return;
      }

      const savedPreset = { ...created, userDefined: true };

      setPreferences((previous) => ({
        ...previous,
        presetId: savedPreset.id,
        isModified: false,
        columnVisibility: previous?.columnVisibility ?? {},
        userPresets: [
          ...(previous?.userPresets ?? []).filter(({ id }) => id !== savedPreset.id),
          savedPreset
        ]
      }));

      // Returning the id lets the table select the preset it just saved
      return savedPreset.id;
    },
    []
  );

  const handleUpdatePreset = useCallback(async (presetId: string, columnIds: string[]) => {
    const existing = (preferencesRef.current?.userPresets ?? []).find(({ id }) => id === presetId);

    if (!existing) {
      return;
    }

    const updated = { ...existing, columns: columnIds, userDefined: true };

    try {
      await updatePresetRef.current?.(updated);
    } catch (error) {
      reportError(error, 'updatePreset');

      return;
    }

    setPreferences((previous) => ({
      ...previous,
      presetId,
      isModified: false,
      columnVisibility: previous?.columnVisibility ?? {},
      userPresets: (previous?.userPresets ?? []).map((preset) => (preset.id === presetId ? updated : preset))
    }));
  }, []);

  const handleDeletePreset = useCallback(async (presetId: string) => {
    const existing = (preferencesRef.current?.userPresets ?? []).find(({ id }) => id === presetId);

    if (!existing) {
      return;
    }

    try {
      await deletePresetRef.current?.(existing);
    } catch (error) {
      reportError(error, 'deletePreset');

      return;
    }

    setPreferences((previous) => ({
      ...previous,
      // The table drops the selection too, but the visible columns are deliberately left alone
      presetId: previous?.presetId === presetId ? null : (previous?.presetId ?? null),
      isModified: previous?.presetId === presetId ? false : previous?.isModified,
      columnVisibility: previous?.columnVisibility ?? {},
      userPresets: (previous?.userPresets ?? []).filter(({ id }) => id !== presetId)
    }));
  }, []);

  const mergedPresets = useMemo(() => {
    const userPresets = (preferences?.userPresets ?? []).map((preset) => ({ ...preset, userDefined: true }));
    const providedIds = new Set(presets.map(({ id }) => id));

    return [...presets, ...userPresets.filter(({ id }) => !providedIds.has(id))];
  }, [presets, preferences?.userPresets]);

  return {
    ready,
    preferences,
    presets: mergedPresets,
    // A loaded preferences object with a null presetId means the user intentionally has no preset
    // applied, so the default must not be reinstated
    initialPresetId: loadedPreferences ? loadedPreferences.presetId ?? undefined : defaultPresetId,
    initialPresetModified: loadedPreferences?.isModified,
    initialColumnVisibility: loadedPreferences?.columnVisibility,
    presetChangeSubscriber,
    onSavePreset: createPreset ? handleSavePreset : undefined,
    onUpdatePreset: updatePreset ? handleUpdatePreset : undefined,
    onDeletePreset: deletePreset ? handleDeletePreset : undefined
  };
};

export default useTableColumnPresets;

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
   * Layouts the user saved themselves. These are merged into the preset list and rendered in the
   * separated group below the divider.
   */
  userPresets?: TableColumnPreset[];
}

/**
 * A storage adapter. Implement this against your own user preferences API - both methods may be
 * synchronous or return a promise.
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
   * Turns on the "Save as new preset" button. Return the preset to save (prompt the user for a
   * name here), or null to cancel. The returned preset is persisted as a user defined preset.
   */
  createPreset?: (
    columnIds: string[],
    sourcePreset: TableColumnPreset | null
  ) => TableColumnPreset | null | Promise<TableColumnPreset | null>;
}

export interface UseTableColumnPresetsResult {
  /**
   * False until the stored configuration has been loaded. Because the table's initialPresetId and
   * initialColumnVisibility props only seed state on mount, do not render the table until this
   * is true: `{ready && <Table … />}`.
   */
  ready: boolean;
  /**
   * The last configuration the hook saved (or loaded), for display or debugging.
   */
  preferences: TableColumnPreferences | null;
  presets: TableColumnPreset[];
  initialPresetId?: string;
  initialColumnVisibility?: VisibilityState;
  presetChangeSubscriber: (presetState: TableColumnPresetState) => void;
  onSavePreset?: (columnIds: string[], sourcePreset: TableColumnPreset | null) => Promise<string | void>;
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
  createPreset
}: UseTableColumnPresetsProps): UseTableColumnPresetsResult => {
  const [ready, setReady] = useState(false);
  const [preferences, setPreferences] = useState<TableColumnPreferences | null>(null);

  // Held in refs so re-created inline adapters and callbacks do not re-trigger the effects below
  const storageRef = useRef(storage);
  storageRef.current = storage;

  const createPresetRef = useRef(createPreset);
  createPresetRef.current = createPreset;

  const lastSavedRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const finish = (loaded: TableColumnPreferences | null) => {
      if (cancelled) {
        return;
      }

      if (loaded) {
        setPreferences(loaded);
        lastSavedRef.current = JSON.stringify(loaded);
      }

      setReady(true);
    };

    if (!storageRef.current) {
      setReady(true);

      return;
    }

    Promise.resolve(storageRef.current.load())
      .then(finish)
      .catch(() => finish(null));

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

    Promise.resolve(storageRef.current?.save(JSON.parse(debouncedPreferences))).catch(() => {
      // Saving preferences is best effort - a failure should never break the table
      lastSavedRef.current = null;
    });
  }, [ready, debouncedPreferences]);

  const presetChangeSubscriber = useCallback((presetState: TableColumnPresetState) => {
    setPreferences((previous) => ({
      ...previous,
      presetId: presetState.presetId,
      columnVisibility: presetState.columnVisibility
    }));
  }, []);

  const handleSavePreset = useCallback(
    async (columnIds: string[], sourcePreset: TableColumnPreset | null) => {
      const created = await createPresetRef.current?.(columnIds, sourcePreset);

      if (!created) {
        return;
      }

      setPreferences((previous) => ({
        presetId: created.id,
        columnVisibility: previous?.columnVisibility ?? {},
        userPresets: [
          ...(previous?.userPresets ?? []).filter(({ id }) => id !== created.id),
          { ...created, userDefined: true }
        ]
      }));

      // Returning the id lets the table select the preset it just saved
      return created.id;
    },
    []
  );

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
    initialPresetId: preferences ? preferences.presetId ?? undefined : defaultPresetId,
    initialColumnVisibility: preferences?.columnVisibility,
    presetChangeSubscriber,
    onSavePreset: createPreset ? handleSavePreset : undefined
  };
};

export default useTableColumnPresets;

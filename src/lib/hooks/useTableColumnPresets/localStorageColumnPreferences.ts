import { TableColumnPreferences, TableColumnPreferencesStorage } from './useTableColumnPresets';

/**
 * A reference `TableColumnPreferencesStorage` implementation backed by `localStorage`.
 *
 * Use it for prototypes and for configuration that does not need to follow a user between devices.
 * For anything else, implement `TableColumnPreferencesStorage` against your own user preferences
 * API - this adapter exists to show how little surface that takes.
 *
 * @param key the localStorage key to read and write
 */
const createLocalStorageColumnPreferences = (key: string): TableColumnPreferencesStorage => ({
  load: () => {
    try {
      const stored = window.localStorage.getItem(key);

      return stored ? (JSON.parse(stored) as TableColumnPreferences) : null;
    } catch {
      // Unavailable or unparseable storage should fall back to the provided defaults
      return null;
    }
  },
  save: (preferences: TableColumnPreferences) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(preferences));
    } catch {
      // Saving preferences is best effort
    }
  }
});

export default createLocalStorageColumnPreferences;

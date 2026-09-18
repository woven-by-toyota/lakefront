import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Column } from '@tanstack/react-table';
import CheckboxGroup, { CheckboxGroupOption } from '../CheckboxGroup/CheckboxGroup';
import { ReactComponent as SettingsIcon } from './assets/settings.svg';
import { ReactComponent as CloseIcon } from './assets/closeIcon.svg';
import { ReactComponent as DownloadIcon } from './assets/download.svg';
import { ReactComponent as RevertIcon } from './assets/revert.svg';
import { ReactComponent as DeleteIcon } from '../Button/assets/delete.svg';
import {
  SettingsOpenBackgroundContainer,
  SettingsOpenForegroundContainer,
  SettingsHeader,
  SettingsContent,
  ColumnCheckboxList,
  SettingsRowContainer,
  SettingsContentSection,
  TextButtonContainer,
  PresetList,
  PresetRow,
  PresetRowContainer,
  PresetDeleteButton,
  PresetModifiedChip,
  PresetColumnCount,
  PresetGroupDivider,
  SettingsSectionDivider,
  UnsavedChangesCallout
} from './tableSettingsStyles';
import Button from 'src/components/Button';
import { TableSettingsConfig } from 'src/components/Table/Table';
import { getConfigurableColumns, TableColumnPreset } from './tableColumnPresetUtil';

export interface TableSettingsProps<T = any> extends TableSettingsConfig {
  columns: Column<T, any>[];
  onColumnVisibilityChange: (columnId: string, visible: boolean) => void;
  getColumnVisibility: (columnId: string) => boolean;
  stickyHeaders?: boolean;
  hasModifiedSettings?: boolean;
  onDownload?: () => void;
  buttonDisplayStyle?: 'icons' | 'text';
  onHeightChange?: (height: number) => void;
  overlayPosition?: 'left' | 'right';
  /**
   * The id of the applied column preset, or null when none is applied.
   */
  activePresetId?: string | null;
  /**
   * True when the visible columns no longer match the applied preset.
   */
  presetModified?: boolean;
  /**
   * Applies the given preset.
   */
  onApplyPreset?: (presetId: string) => void;
  /**
   * Restores the applied preset's columns, discarding manual changes.
   */
  onRevertPreset?: () => void;
  /**
   * When provided, renders the "Save New" button in the unsaved changes callout.
   */
  onSavePreset?: (columnIds: string[], sourcePreset: TableColumnPreset | null) => void;
  /**
   * When provided, renders the "Save" button in the unsaved changes callout, which overwrites the
   * applied preset. Only enabled for user defined presets.
   */
  onUpdatePreset?: (presetId: string, columnIds: string[]) => void;
  /**
   * When provided, renders a delete control on user defined preset rows.
   */
  onDeletePreset?: (presetId: string) => void;
}

const TableSettings: React.FC<TableSettingsProps> = ({
  columns,
  onColumnVisibilityChange,
  getColumnVisibility,
  columnConfig,
  stickyHeaders = false,
  hasModifiedSettings = false,
  onDownload,
  buttonDisplayStyle = 'icons',
  onHeightChange,
  overlayPosition,
  activePresetId = null,
  presetModified = false,
  onApplyPreset,
  onRevertPreset,
  onSavePreset,
  onUpdatePreset,
  onDeletePreset
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Measure and report container height
  useEffect(() => {
    if (containerRef.current && onHeightChange) {
      const observer = new ResizeObserver(() => {
        // Use offsetHeight instead of contentRect.height to include padding/borders
        if (containerRef.current) {
          onHeightChange(containerRef.current.offsetHeight);
        }
      });

      observer.observe(containerRef.current);

      // Defer initial measurement to ensure browser has laid out the element
      requestAnimationFrame(() => {
        if (containerRef.current) {
          onHeightChange(containerRef.current.offsetHeight);
        }
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [onHeightChange]);

  // Filter out columns that shouldn't be in the settings
  const configurableColumns = getConfigurableColumns(columns);

  // Convert columns to CheckboxGroup options
  const checkboxOptions: CheckboxGroupOption[] = useMemo(() => {
    return configurableColumns.map((column) => {
      const columnHeader = typeof column.columnDef.header === 'function'
        ? column.id
        : column.columnDef.header;

      const { columnLabelTransform = (label: string) => label } = columnConfig || {};
      const label = columnLabelTransform(columnHeader as string);

      return {
        value: column.id,
        label: label
      };
    });
  }, [configurableColumns, columnConfig]);

  // Get selected (visible) columns as a Set
  const selectedColumns = useMemo(() => {
    return new Set(
      configurableColumns
        .filter(column => getColumnVisibility(column.id))
        .map(column => column.id)
    );
  }, [configurableColumns, getColumnVisibility]);

  // Split presets into the built in group and the separated user defined group
  const { presets = [] } = columnConfig || {};

  const [builtInPresets, userDefinedPresets] = useMemo(() => {
    return [
      presets.filter((preset) => !preset.userDefined),
      presets.filter((preset) => preset.userDefined)
    ];
  }, [presets]);

  const activePreset = useMemo(
    () => presets.find((preset) => preset.id === activePresetId) ?? null,
    [presets, activePresetId]
  );

  // Visible configurable columns, in column order, for the save preset callback
  const visibleColumnIds = useMemo(
    () => configurableColumns.filter((column) => getColumnVisibility(column.id)).map((column) => column.id),
    [configurableColumns, getColumnVisibility]
  );

  const renderPreset = (preset: TableColumnPreset) => {
    const isActive = preset.id === activePresetId;
    const isModified = isActive && presetModified;
    // Only the user's own presets can be deleted - built in ones come from the consumer's code
    const isDeletable = Boolean(onDeletePreset && preset.userDefined);

    return (
      // The delete control is a sibling rather than a child of the row, since a button cannot nest
      <PresetRowContainer key={preset.id}>
        <PresetRow
          type="button"
          role="option"
          aria-selected={isActive}
          selected={isActive}
          modified={isModified}
          deletable={isDeletable}
          onClick={() => onApplyPreset?.(preset.id)}
        >
          <span className="preset-label">
            {preset.label}
            {isModified && <PresetModifiedChip>Modified</PresetModifiedChip>}
          </span>
          <PresetColumnCount>{preset.columns.length} cols</PresetColumnCount>
        </PresetRow>
        {isDeletable && (
          <PresetDeleteButton
            type="button"
            className="delete-preset-button"
            aria-label={`Delete ${preset.label} preset`}
            title={`Delete ${preset.label} preset`}
            onClick={() => onDeletePreset?.(preset.id)}
          >
            <DeleteIcon />
          </PresetDeleteButton>
        )}
      </PresetRowContainer>
    );
  };

  // Handle checkbox group changes
  const handleCheckboxGroupChange = (selected: Set<string>) => {
    // Determine which columns changed
    configurableColumns.forEach((column) => {
      const wasVisible = getColumnVisibility(column.id);
      const isVisible = selected.has(column.id);

      if (wasVisible !== isVisible) {
        onColumnVisibilityChange(column.id, isVisible);
      }
    });
  };

  // Settings overlay panel (same for both styles)
  const settingsOverlay = isOpen ? (
    <>
      <SettingsOpenBackgroundContainer onClick={handleClose} aria-label='table settings background' />
      <SettingsOpenForegroundContainer aria-label='table settings foreground' position={overlayPosition}>
        <SettingsHeader>
          <h4>Table Settings</h4>
          <Button
            icon={<CloseIcon />}
            onClick={handleClose}
            className="close-icon"
            aria-label="Close"
          />
        </SettingsHeader>
        <SettingsContent>
          <SettingsContentSection>
            {presets.length > 0 && (
              <>
                <h5>Column Configuration</h5>
                <PresetList role="listbox" aria-label="Column configuration">
                  {builtInPresets.map(renderPreset)}
                  {builtInPresets.length > 0 && userDefinedPresets.length > 0 && <PresetGroupDivider />}
                  {userDefinedPresets.map(renderPreset)}
                </PresetList>
                {activePreset && presetModified && (
                  <UnsavedChangesCallout>
                    <p>{activePreset.label} &mdash; unsaved changes</p>
                    <div className="callout-actions">
                      {onUpdatePreset && (
                        <button
                          type="button"
                          className="update-preset-button"
                          disabled={!activePreset.userDefined}
                          title={
                            activePreset.userDefined
                              ? `Overwrite ${activePreset.label}`
                              : `${activePreset.label} is a built in preset and cannot be overwritten`
                          }
                          onClick={() => onUpdatePreset(activePreset.id, visibleColumnIds)}
                        >
                          Save
                        </button>
                      )}
                      {onSavePreset && (
                        <button
                          type="button"
                          className="save-preset-button"
                          title="Save these columns as a new preset"
                          onClick={() => onSavePreset(visibleColumnIds, activePreset)}
                        >
                          Save New
                        </button>
                      )}
                      <button
                        type="button"
                        className="revert-preset-button"
                        title={`Restore ${activePreset.label}'s columns`}
                        onClick={onRevertPreset}
                      >
                        <RevertIcon />Revert
                      </button>
                    </div>
                  </UnsavedChangesCallout>
                )}
              </>
            )}
            {presets.length > 0 && columnConfig?.enableColumnHiding && <SettingsSectionDivider />}
            {columnConfig?.enableColumnHiding && (
              <>
                <h5>Columns</h5>
                <ColumnCheckboxList>
                  <CheckboxGroup
                    name="table-columns"
                    options={checkboxOptions}
                    selected={selectedColumns}
                    onHandleChange={handleCheckboxGroupChange}
                    allLabel="Show/Hide All"
                    showAllDivider={false}
                  />
                </ColumnCheckboxList>
              </>
            )}
          </SettingsContentSection>
        </SettingsContent>
      </SettingsOpenForegroundContainer>
    </>
  ) : null;

  // Text button style
  if (buttonDisplayStyle === 'text') {
    return (
      <TextButtonContainer ref={containerRef} sticky={stickyHeaders} hasModifiedSettings={hasModifiedSettings}>
        <button
          onClick={handleToggle}
          className="text-button settings-button"
          aria-label="Table settings"
          title="Table settings"
        >
          <SettingsIcon /><span>Settings</span>
        </button>
        {onDownload && (
          <button
            onClick={onDownload}
            className="text-button download-button"
            aria-label="Download table data"
            title="Download table data"
          >
            <DownloadIcon /><span>Export CSV</span>
          </button>
        )}
        {settingsOverlay}
      </TextButtonContainer>
    );
  }

  // Icon button style (default)
  return (
    <SettingsRowContainer ref={containerRef} sticky={stickyHeaders} hasModifiedSettings={hasModifiedSettings}>
      <div className="button-container">
        <Button
          icon={<SettingsIcon />}
          onClick={handleToggle}
          className="settings-icon"
          aria-label="Table settings"
          title="Table settings"
        />
        {onDownload && (
          <Button
            icon={<DownloadIcon />}
            onClick={onDownload}
            className="download-icon"
            aria-label="Download table data"
            title="Download table data"
          />
        )}
      </div>
      {settingsOverlay}
    </SettingsRowContainer>
  );
};

export default TableSettings;

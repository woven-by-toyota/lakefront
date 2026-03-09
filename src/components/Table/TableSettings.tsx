import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Column } from '@tanstack/react-table';
import CheckboxGroup, { CheckboxGroupOption } from '../CheckboxGroup/CheckboxGroup';
import { ReactComponent as SettingsIcon } from './assets/settings.svg';
import { ReactComponent as CloseIcon } from './assets/closeIcon.svg';
import { ReactComponent as DownloadIcon } from './assets/download.svg';
import {
  SettingsOpenBackgroundContainer,
  SettingsOpenForegroundContainer,
  SettingsHeader,
  SettingsContent,
  ColumnCheckboxList,
  SettingsRowContainer,
  SettingsContentSection,
  TextButtonContainer
} from './tableSettingsStyles';
import Button from 'src/components/Button';
import { TableSettingsConfig } from 'src/components/Table/Table';

export interface TableSettingsProps<T = any> extends TableSettingsConfig {
  columns: Column<T, any>[];
  onColumnVisibilityChange: (columnId: string, visible: boolean) => void;
  getColumnVisibility: (columnId: string) => boolean;
  stickyHeaders?: boolean;
  hasModifiedSettings?: boolean;
  onDownload?: () => void;
  buttonDisplayStyle?: 'icons' | 'text';
  onHeightChange?: (height: number) => void;
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
  onHeightChange
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
  const configurableColumns = columns.filter((column) => {
    const columnDef = column.columnDef;
    // Skip columns without an id or header
    if (!column.id || !columnDef.header) return false;
    // Skip special columns like actions
    if (column.id === 'more-actions') return false;
    // Include/Skip columns based on enableHiding flag
    return columnDef.enableHiding !== false;
  });

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
      <SettingsOpenForegroundContainer aria-label='table settings foreground'>
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

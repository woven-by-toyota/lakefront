import React, { useState, useMemo } from 'react';
import { Column } from '@tanstack/react-table';
import CheckboxGroup, { CheckboxGroupOption } from '../CheckboxGroup/CheckboxGroup';
import { ReactComponent as SettingsIcon } from './assets/settings.svg';
import { ReactComponent as CloseIcon } from './assets/closeIcon.svg';
import {
  SettingsOpenBackgroundContainer,
  SettingsOpenForegroundContainer,
  SettingsHeader,
  SettingsContent,
  ColumnCheckboxList,
  SettingsRowContainer,
  SettingsContentSection
} from './tableSettingsStyles';
import Button from 'src/components/Button';
import { TableSettingsConfig } from 'src/components/Table/Table';

export interface TableSettingsProps<T = any> extends TableSettingsConfig {
  columns: Column<T, any>[];
  onColumnVisibilityChange: (columnId: string, visible: boolean) => void;
  getColumnVisibility: (columnId: string) => boolean;
  stickyHeaders?: boolean;
  hasModifiedSettings?: boolean;
}

const TableSettings: React.FC<TableSettingsProps> = ({
  columns,
  onColumnVisibilityChange,
  getColumnVisibility,
  columnConfig,
  stickyHeaders = false,
  hasModifiedSettings = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

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

  return (
    <SettingsRowContainer sticky={stickyHeaders} hasModifiedSettings={hasModifiedSettings}>
      <div className="button-container">
        <Button
          icon={<SettingsIcon />}
          onClick={handleToggle}
          className="settings-icon"
          aria-label="Table settings"
          title="Table settings"
        />
      </div>
      {isOpen && (
        <>
          <SettingsOpenBackgroundContainer onClick={handleClose} />
          <SettingsOpenForegroundContainer>
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
      )}
    </SettingsRowContainer>
  );
};

export default TableSettings;

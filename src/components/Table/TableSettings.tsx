import React, { useState } from 'react';
import { Column } from '@tanstack/react-table';
import Checkbox from '../Checkbox/Checkbox';
import { ReactComponent as SettingsIcon } from './assets/settings.svg';
import { ReactComponent as CloseIcon } from './assets/closeIcon.svg';
import {
  SettingsOpenBackgroundContainer,
  SettingsOpenForegroundContainer,
  SettingsHeader,
  SettingsContent,
  ColumnCheckboxList,
  SettingsRowContainer
} from './tableSettingsStyles';
import Button from 'src/components/Button';
import { TableSettingsConfig } from 'src/components/Table/Table';

export interface TableSettingsProps<T = any> extends TableSettingsConfig {
  columns: Column<T, any>[];
  onColumnVisibilityChange: (columnId: string, visible: boolean) => void;
  getColumnVisibility: (columnId: string) => boolean;
}

const TableSettings: React.FC<TableSettingsProps> = ({
  columns,
  onColumnVisibilityChange,
  getColumnVisibility,
  enableColumnHiding
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

  return (
    <SettingsRowContainer>
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
              {enableColumnHiding && (
                <>
                  <h5>Columns</h5>
                  <ColumnCheckboxList>
                    {configurableColumns.map((column) => {
                      const isVisible = getColumnVisibility(column.id);
                      const columnHeader = typeof column.columnDef.header === 'function'
                        ? column.id
                        : column.columnDef.header;

                      return (
                        <Checkbox
                          key={column.id}
                          checked={isVisible}
                          onChange={() => onColumnVisibilityChange(column.id, !isVisible)}
                          label={columnHeader as string}
                        />
                      );
                    })}
                  </ColumnCheckboxList></>
              )}
            </SettingsContent>
          </SettingsOpenForegroundContainer>
        </>
      )}
    </SettingsRowContainer>
  );
};

export default TableSettings;

import React, { useState } from 'react';
import { Column } from '@tanstack/react-table';
import Checkbox from '../Checkbox/Checkbox';
import { ReactComponent as SettingsIcon } from './assets/settings.svg';
import {
  SettingsOverlay,
  SettingsContainer,
  SettingsHeader,
  SettingsContent,
  SettingsCloseButton,
  ColumnCheckboxList,
  SettingsRowContainer
} from './tableSettingsStyles';
import Button from 'src/components/Button';

export interface TableSettingsProps<T = any> {
  columns: Column<T, any>[];
  onColumnVisibilityChange: (columnId: string, visible: boolean) => void;
  getColumnVisibility: (columnId: string) => boolean;
}

const TableSettings: React.FC<TableSettingsProps> = ({
  columns,
  onColumnVisibilityChange,
  getColumnVisibility
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
    // Skip columns that have enableHiding set to false
    if (columnDef.enableHiding === false) return false;
    return true;
  });

  return (
    <SettingsRowContainer>
     <div className='button-container'>
       <Button
         icon={<SettingsIcon />}
         onClick={handleToggle}
         aria-label="Table settings"
         title="Table settings"
       />
     </div>

      {isOpen && (
        <>
          <SettingsOverlay onClick={handleClose} />
          <SettingsContainer>
            <SettingsHeader>
              <h3>Table Settings</h3>
              <SettingsCloseButton onClick={handleClose} aria-label="Close">
                ×
              </SettingsCloseButton>
            </SettingsHeader>
            <SettingsContent>
              <h4>Show/Hide Columns</h4>
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
              </ColumnCheckboxList>
            </SettingsContent>
          </SettingsContainer>
        </>
      )}
    </SettingsRowContainer>
  );
};

export default TableSettings;

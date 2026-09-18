import React, { FC, ReactElement } from 'react';
import styled from '@emotion/styled';
import Checkbox from 'src/components/Checkbox/Checkbox';
import colors from 'src/styles/lakefrontColors';

const StyledDivider = styled.div({
  backgroundColor: colors.alto,
  height: 1,
  width: '95%',
  margin: '8px 0px'
});

const CheckboxGroupWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column'
});

export interface CheckboxGroupOption {
  value: string;
  label: string | ReactElement;
  color?: string;
  description?: string;
}

export interface CheckboxGroupProps {
  /**
   * The options that should be displayed in the checkbox group.
   */
  options: CheckboxGroupOption[];
  /**
   * These are the classes that would be applied to the Checkbox group.
   */
  className?: string;
  /**
   * The action that should be run when the checked state changes.
   */
  onHandleChange(items: Set<string>): void;
  /**
   * The name of the Checkbox group.
   */
  name: string;
  /**
   * The options that are checked when the control loads.
   */
  selected: Set<string>;
  /**
   * This option is to select or unselect all the checkboxes.
   * Specify the name of the label to be displayed for checkbox.
   */
  allLabel?: string;
  /**
   * This option is used to set the select all checkbox color.
   */
  allColor?: string;
  /**
   * Whether to render a divider between the `allLabel` checkbox and the options. Defaults to true.
   */
  showAllDivider?: boolean;
}

/**
 * The Checkbox Group Component
 *
 * The CheckboxGroup component can be used to provide multiple checkbox options. The user can set default selection on
 * the checkbox group render. The All option is provided to check or uncheck all the options.
 */
const CheckboxGroup: FC<CheckboxGroupProps> = ({
  allColor,
  allLabel,
  className,
  name,
  onHandleChange,
  options,
  selected,
  showAllDivider = true
}) => {
  const isItemChecked = (value: string) => {
    return selected.has(value);
  };

  const onItemChange = (value: string) => {
    if (selected.has(value)) {
      // remove item
      selected.delete(value);
    } else {
      // add item
      selected.add(value);
    }
    onHandleChange(new Set(selected));
  };

  const onAllItemChange = () => {
    const isAllSelected = selected.size === options.length;

    let newSelection;
    if (isAllSelected) {
      // remove all items
      newSelection = new Set([]);
    } else {
      // add all items
      newSelection = new Set(options.map((item) => item.value));
    }
    onHandleChange(newSelection);
  };

  const isAllSelected = selected.size != 0 && selected.size === options.length;

  return (
    <CheckboxGroupWrapper className={className}>
      {allLabel && (
        <>
          <Checkbox
            value="all"
            label={allLabel}
            color={allColor}
            id={`checkbox-${name}-all`}
            labelClassName="checkbox-group-all"
            onChange={onAllItemChange}
            checked={isAllSelected}
          />
          {showAllDivider && <StyledDivider />}
        </>
      )}

      {options.map((option) => {
        const isSelected = isItemChecked(option.value);
        const checkBoxId = `checkbox-${name}-${option.value}`;
        return (
          <Checkbox
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            id={checkBoxId}
            onChange={(evt) => onItemChange(evt.target.value)}
            checked={isSelected}
            color={option.color}
          />
        );
      })}
    </CheckboxGroupWrapper>
  );
};

export default CheckboxGroup;

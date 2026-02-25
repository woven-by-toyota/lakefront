import {
  ChangeEvent,
  ComponentPropsWithoutRef,
  DragEvent,
  FC,
  ReactElement,
  useState
} from 'react';
import { ThemeProvider } from '@emotion/react';
import { StyledCheckbox, StyledLabel } from './checkboxStyles';
import { ReactComponent as Check } from './assets/check.svg';
import { ReactComponent as Indeterminate } from './assets/indeterminate.svg';
import theme from 'src/styles/theme';

export interface CheckboxProps {
  /**
   * The value to control whether the checkbox should be checked or not.
   */
  checked?: boolean;
  /**
   * The svg icon to display when checked is true. If left undefined, a check mark will be displayed.
   */
  checkedIcon?: ReactElement<SVGElement>;
  /**
   * A display state in which it is unknown whether checked should be true or false.
   */
  indeterminate?: boolean;
  /**
   * The (optional) label for the checkbox.
   */
  label?: string | ReactElement;
  /**
   * HTML input element disabled prop.
   */
  disabled?: boolean;
  /**
   * The action that should be run when the checked state changes.
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * The classes to pass to the checkbox.
   */
  className?: string;
  /**
   * The classes to pass to the checkbox label.
   */
  labelClassName?: string;
  description?: string;
}

/**
 * Checkbox Component
 *
 * The Checkbox component takes in native checkbox props as well as its own CheckboxProps.
 * The `checked` state is not managed in the component and should be received
 * via the `checked` prop from the consuming app.
 *
 */
const Checkbox: FC<CheckboxProps & ComponentPropsWithoutRef<'input'>> = ({
  checked = false,
  checkedIcon,
  indeterminate = false,
  label = '',
  disabled = false,
  onChange = () => null,
  labelClassName,
  description,
  ...props
}) => {
  const showIcon = indeterminate || checked;
  const icon = indeterminate ? <Indeterminate /> : checkedIcon || <Check />;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(event);
    }
  };

  return (
      <StyledLabel
        disabled={disabled}
        indeterminate={indeterminate}
        className={labelClassName}
      >
        <StyledCheckbox
          {...props}
          indeterminate={indeterminate}
          disabled={disabled}
          onChange={handleChange}
          checked={checked}
          type="checkbox"
        />
        {showIcon && icon}
        {!description && label && <span>{label}</span>}
        {description && label && <div>{label}</div>}
        {description && <div>{description}</div>}
      </StyledLabel>
  );
};

export default Checkbox;

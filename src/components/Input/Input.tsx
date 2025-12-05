import { FC, forwardRef, ComponentPropsWithRef } from 'react';
import { StyledInput, StyledLabel } from './inputStyles';

export interface InputProps {
  /**
   * This shows a label above the input when provided.
   */
  label?: string;
  /**
   * If not empty, the input component will be displayed in an error state with the provided error message.
   */
  error?: string;
  /**
   * If required is provided, the label of the input component will be displayed with a red asterisk at its end.
   */
  required?: boolean;
  /**
   * The classes to pass to the input.
   */
  className?: string;
  /**
   * The classes to pass to the input label.
   */
  labelClassName?: string;
}

/**
 * Input Component
 *
 * The Input component takes in native input props as well as its own InputProps. The state is not managed
 * in this component and should be handled in the consuming app.
 *
 */
const Input: FC<InputProps & ComponentPropsWithRef<'input'>> = forwardRef(({
    label,
    error = '',
    required,
    labelClassName,
    ...props
  }, ref) => (
    <StyledLabel error={error} className={labelClassName}>
      {label && <span>{label}{required && <span className="required-field">*</span>}</span>}
      <StyledInput ref={ref} error={error} {...props} />
      <div>{error}</div>
    </StyledLabel>
  )
);

export default Input;

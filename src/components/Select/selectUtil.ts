import { SelectProps } from 'src/components/Select/Select';
import { ComponentProps } from 'react';

// Keys of native select attributes to be extracted from props
// This is not exhaustive of all native select attributes, only a few common ones
const NATIVE_SELECT_KEYS = Object.keys({
    'aria-label': undefined,
    'aria-labelledby': undefined,
    'aria-describedby': undefined,
    'aria-errormessage': undefined,
    'aria-required': undefined,
    'aria-invalid': undefined,
    'aria-*': undefined,
    'title': undefined,
    'data-*': undefined
  } as ComponentProps<'select'>);

/**
 * Utility to extract native select props from SelectProps
 * @param props
 */
export const extractNativeSelectProps = (props: SelectProps): ComponentProps<'select'> => {
  const {
    id,
    disabled,
    autoFocus,
    name,
    required,
    value,
    defaultValue,
    onChange,
    onBlur,
    form,
    tabIndex,
    className,
    isMulti,
    ...rest
  } = props;

  const additionalNativeProps = Object.fromEntries(
    Object.entries(rest).filter(([key]) => NATIVE_SELECT_KEYS.includes(key))
  );

  return {
    id,
    disabled,
    autoFocus,
    name,
    required,
    value,
    // Filter defaultValue to be compatible
    defaultValue: typeof defaultValue === 'string' || typeof defaultValue === 'number' || Array.isArray(defaultValue) ? defaultValue : undefined,
    multiple: isMulti,
    onChange,
    onBlur,
    form,
    tabIndex,
    className,
    ...additionalNativeProps
  };
};
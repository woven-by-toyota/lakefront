import {
    ChangeEvent,
    ComponentPropsWithoutRef,
    FC,
    ReactElement
  } from 'react';
  import { StyledRadioGroup, StyledLabel, StyledCheckedIcon, StyledUncheckedIcon } from './radioGroupStyles';

  export interface RadioGroupProps {
    /**
     * The name of the radio button group.
     */
    name: string;
    /**
     * The options of each radio button within the radio group.
     * Options include the `label` (appearance), `value` (returned on selection),
     * and whether the individual option is `disabled`.
     */
    options: {
        value: string | number;
        label: string | ReactElement;
        disabled?: boolean;
    }[];
    /**
     * The value of the selected radio button.
     */
    value: string | number;
    /**
     * HTML input element disabled prop.
     */
    disabled?: boolean;
    /**
     * The action that should be run when a radio button is selected.
     */
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    /**
     * The classes to pass to the radio group.
     */
    className?: string;
    /**
     * The classes to pass to the radio group label.
     */
    labelClassName?: string;
  }

  /**
   * RadioGroup Component
   *
   * The RadioGroup component takes in native radio button props as well as its own RadioGroupProps.
   *
   */
  const RadioGroup: FC<RadioGroupProps & ComponentPropsWithoutRef<'input'>> = ({
    name,
    options,
    value,
    disabled = false,
    onChange = () => null,
    labelClassName,
    ...props
  }) => {

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        onChange(event);
      }
    };

    return (
      <>
      {
        options.map((option) => {

          const checked = value === option.value;
          const disableOption = disabled || option.disabled;
          const icon = value === option.value ?
            <StyledCheckedIcon disabled={disableOption} /> :
            <StyledUncheckedIcon disabled={disableOption} />;

          return (
            <StyledLabel disabled={disableOption} className={labelClassName}>
              <StyledRadioGroup
                {...props}
                name={name}
                options={options}
                value={option.value}
                disabled={disableOption}
                onChange={disableOption ? () => null : handleChange}
                type="radio"
                checked={checked}
              />
              {icon}
              {option.label && <div className="label">{option.label}</div>}
            </StyledLabel>
          );
        })
      }
      </>
    );
  };

  export default RadioGroup;

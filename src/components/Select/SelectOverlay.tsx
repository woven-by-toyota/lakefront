import { FC, useMemo, useState } from 'react';
import { SelectProps } from './Select';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { SELECT_OVERLAY_STYLES } from './selectStyles';
import theme from 'src/styles/theme';

const SelectOverlay: FC<SelectProps> = ({
    isSearchable = false,
    disabled,
    id,
    options,
    onChange,
    value,
    multiValue: multiValueOverride,
    isMulti,
    multiDefaultValue = [],
    asyncConfig,
    styles,
    ...rest
}) => {
    const [multiValues, setMultiValues] = useState(multiDefaultValue);

    const { currentValue, defaultValue, selectId } = useMemo(
        () => {
            const multiSelectValue = multiValueOverride || multiValues;
            return {
                currentValue: !isMulti ? options.find((option: { value: any; }) => option.value === value) : multiSelectValue,
                defaultValue: options[0],
                selectId: id ? `select-overlay-${id}` : undefined
            };
        },
        [options, value, multiValues, multiValueOverride]
    );


    const handleChange = (option: any) => {
        if (!isMulti) {
            const newValue = option?.value;
            onChange({
                target: { value: newValue },
                currentTarget: { value: newValue }
            });
        }
        else {
            const eventTargetValues = option.map((o: { value: any; }) => o.value);
            onChange({
                target: {value: eventTargetValues},
                currentTarget: {value: eventTargetValues}
            });
            setMultiValues(option);
        }
    };

    const commonProps = {
        isDisabled: disabled,
        id: selectId,
        defaultValue: defaultValue,
        value: currentValue,
        options: options,
        onChange: handleChange,
        styles: { ...SELECT_OVERLAY_STYLES, ...styles },
        theme: (defaultTheme: any) => ({
            ...defaultTheme,
            colors: {
                ...defaultTheme.colors,
                ...theme.colors,
                primary: theme.colors.white,
                primary25: disabled ? theme.colors.white : theme.colors.mercury
            }
        }),
        isSearchable: isSearchable,
        isMulti: isMulti
    };

    if (asyncConfig) {
        return (
            <AsyncSelect
              {...commonProps}
              {...asyncConfig}
            />
        );
    }

    return (
        <Select
          {...commonProps}
          {...rest}
        />
    );
};

export default SelectOverlay;

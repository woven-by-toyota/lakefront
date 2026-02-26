import { FC, useMemo, useState } from 'react';
import { useTheme } from '@emotion/react';
import { SelectProps } from './Select';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { getSelectOverlayStyles } from './selectStyles';

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
    const theme = useTheme();
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
        styles: { ...getSelectOverlayStyles(theme), ...styles },
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

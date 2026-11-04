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
        theme: (defaultTheme: any) => ({
            ...defaultTheme,
            colors: {
                ...defaultTheme.colors,
                primary: theme.backgrounds.primary,
                primary25: theme.backgrounds.hover,
                neutral0: theme.backgrounds.primary,
                neutral80: theme.foregrounds.primary,    // Main text color
                neutral20: theme.foregrounds.secondary,  // Secondary text
                neutral10: theme.backgrounds.secondary   // Chip background
            }
        }),
        isSearchable: isSearchable,
        isMulti: isMulti
    };

    /*
     * SelectProps extends react-select's Props without generic arguments, so they default to
     * Option = unknown while options is narrowed to SelectOption[]. value and onChange are therefore
     * typed against different option types and cannot agree. Parameterising SelectProps over the
     * option type is the real fix, but it changes a public signature, so it is tracked separately.
     */
    if (asyncConfig) {
        return (
            // @ts-expect-error see above: SelectProps leaves Option as unknown
            <AsyncSelect
              {...commonProps}
              {...asyncConfig}
            />
        );
    }

    return (
        // @ts-expect-error see above: SelectProps leaves Option as unknown
        <Select
          {...commonProps}
          {...rest}
        />
    );
};

export default SelectOverlay;

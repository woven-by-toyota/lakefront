import { FC } from 'react';
import MultiSelect from 'src/components/Filter/modules/MultiSelectFilter/MultiSelect';
import styled from '@emotion/styled';
import theme from 'src/styles/theme';
import { DoubleMultiSelectOptions, DoubleMultiSelectValues } from 'src/components/Filter/types';

const FilterTitle = styled.div({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 16
});

const FilterLabel = styled.label({
    color: theme.foregrounds.inverted,
    fontSize: 16
});

const FilterClear = styled.div({
    color: theme.foregrounds.inverted,
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600
});

interface DoubleMultiSelectProps {
    value: DoubleMultiSelectValues;
    onChange(value: DoubleMultiSelectValues | null): void;
    options: DoubleMultiSelectOptions
}

const DoubleMultiSelect: FC<DoubleMultiSelectProps> = ({ value, onChange, options }) => {
    const selectedFirst = value?.firstSelect?.map(item => ({
        label: item,
        value: item
    })) ?? [];

    const selectedSecond = value?.secondSelect?.map(item => ({
        label: item,
        value: item
    })) ?? [];

    const handleChange = (values: string[], key: keyof DoubleMultiSelectValues) => {
        const newValues = {
            ...value,
            [key]: values
        };

        if (
            (!newValues?.firstSelect || newValues?.firstSelect?.length === 0) &&
            (!newValues?.secondSelect || newValues?.secondSelect?.length === 0)
        ) {
            onChange(null);
        } else {
            onChange(newValues);
        }
    };

    const handleClear = (key: keyof DoubleMultiSelectValues) => {
        const newValues = {
            ...value,
            [key]: []
        };

        if (
            (!newValues?.firstSelect || newValues?.firstSelect?.length === 0) &&
            (!newValues?.secondSelect || newValues?.secondSelect?.length === 0)
        ) {
            onChange(null);
        } else {
            onChange(newValues);
        }
    };

    return (
        <div>
            <FilterTitle>
                <FilterLabel>{options.firstSelect.label}</FilterLabel>
                <FilterClear onClick={() => handleClear('firstSelect')}>reset all</FilterClear>
            </FilterTitle>
            <MultiSelect
                value={selectedFirst}
                selectItem={(values) => handleChange(values, 'firstSelect')}
                title={options.firstSelect.name}
                items={options.firstSelect.items}
                creatable={options.firstSelect.creatable}
                placeholder={options.firstSelect.placeholder}
                disableMenu={options.firstSelect.disableMenu}
            />
            <FilterTitle>
                <FilterLabel>{options.secondSelect.label}</FilterLabel>
                <FilterClear onClick={() => handleClear('secondSelect')}>reset all</FilterClear>
            </FilterTitle>
            <MultiSelect
                value={selectedSecond}
                selectItem={(values) => handleChange(values, 'secondSelect')}
                title={options.secondSelect.name}
                items={options.secondSelect.items}
                creatable={options.secondSelect.creatable}
                autoFocus={false}
                placeholder={options.secondSelect.placeholder}
                disableMenu={options.secondSelect.disableMenu}
            />
        </div>
    );
};

export default DoubleMultiSelect;

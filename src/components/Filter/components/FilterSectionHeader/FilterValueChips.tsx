import { FC } from 'react';
import { createChips } from './filterSectionHeaderUtil';
import { FilterModule } from '../../types';

interface FilterValueChipsProps {
    value: string | string[];
    values?: string | string[];
    visible?: boolean;
    label?: FilterModule<any>['label'];
    notDefaultValues?: boolean;
    name: string;
    resetFilter?(name: string, value?: any): void;
}

const FilterValueChips: FC<FilterValueChipsProps> = ({ value, values, visible, name, resetFilter, label, notDefaultValues }) => {
    if (!visible) {
        return null;
    }

    return createChips(value, name, resetFilter, label, notDefaultValues, values);
};

export default FilterValueChips;

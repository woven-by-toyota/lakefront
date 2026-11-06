import type { FilterModule } from 'src/components/Filter/types';
import { camalize } from 'src/lib/format.js';
import { getMinMaxFromKey } from '../../util/durationFilterUtil';
import MinMaxInput, { type MinMax } from '../DurationFilter/MinMaxInput';

export interface MinMaxFilterProps {
    label: string;
    description?: string;
    unitsOfMeasurement?: string;
}

export const MinMaxFilter = ({
    label,
    description,
    unitsOfMeasurement = ''
}: MinMaxFilterProps): FilterModule<MinMax> => ({
    label,
    description,
    getApiQueryUrl: (key, value) => {
        let urlString = '';
        if (value?.min) {
            urlString += `&${camalize(label)}.min=${value.min}`;
        }
        if (value?.max) {
            urlString += `&${camalize(label)}.max=${value.max}`;
        }
        return urlString;
    },
    getApiPostBody: (key, value) => {
        if (value) {
            const postBody: any = {};
            if (value.min) {
                postBody[`${camalize(label)}.min`] = value.min;
            }
            if (value.max) {
                postBody[`${camalize(label)}.max`] = value.max;
            }
            return postBody;
        }

        return undefined;
    },
    getBrowserQueryUrlValue: (value) => {
        return value ? `${value.min ?? ''}~${value.max ?? ''}` : '';
    },
    getDefaultFilterValue: () => null,
    isDefaultFilterValue: (value) => value === null,
    getFilterBarLabel: (value) => {
        if (value) {
            const minStr = value?.min ? `${value.min}` : '0';
            const maxStr = value?.max ? `${value.max}` : '';
            return `${label}: ${minStr} - ${maxStr} ${unitsOfMeasurement}`;
        }
        return '';
    },
    getFilterSectionLabel: (value) => {
        if (value) {
            const minStr = value?.min ? `${value.min}` : '0';
            const maxStr = value?.max ? `${value.max}` : '';
            return `${minStr} - ${maxStr} ${unitsOfMeasurement}`;
        }
        return '';
    },
    parseInitialFilterValue: (browserQueryUrlValue: string) => {
        return browserQueryUrlValue ? getMinMaxFromKey(browserQueryUrlValue) : null;
    },
    renderComponent: ({ value, update }) => (
        <MinMaxInput
            onChange={update}
            value={value}
            allowNegativeInput={false}
        />
    )
});

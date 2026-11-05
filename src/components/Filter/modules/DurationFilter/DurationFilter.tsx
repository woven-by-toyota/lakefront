import type { FilterModule } from 'src/components/Filter/types';
import MinMaxInput, { type MinMax } from './MinMaxInput';
import { getMinMaxFromKey } from '../../util/durationFilterUtil';

export interface DurationFilterProps {
    label: string;
    description?: string;
}


export const DurationFilter = ({ label, description }: DurationFilterProps): FilterModule<MinMax> => ({
    label,
    description,
    getApiQueryUrl: (key, value) => {
        let urlString = '';
        if (value?.min) {
            urlString += `&duration.min=${value.min * 60}`;
        }
        if (value?.max) {
            urlString += `&duration.max=${value.max * 60}`;
        }
        return urlString;
    },
    getApiPostBody: (key, value) => {
        if (value) {
            const postBody: any = {};
            if (value.min) {
                postBody['duration.min'] = value.min * 60;
            }
            if (value.max) {
                postBody['duration.max'] = value.max * 60;
            }
            return postBody;
        }

        return undefined;
    },
    getBrowserQueryUrlValue: value => {
        return value ? `${value.min ?? ''}~${value.max ?? ''}` : '';
    },
    getDefaultFilterValue: () => null,
    isDefaultFilterValue: value => value === null,
    getFilterBarLabel: value => {
        if (value) {
            const minStr = value?.min ? `${value.min}` : '0';
            const maxStr = value?.max ? `${value.max}` : '';
            return `Duration: ${minStr} - ${maxStr} mins`;
        }
        return '';
    },
    getFilterSectionLabel: value => {
        if (value) {
            const minStr = value?.min ? `${value.min}` : '0';
            const maxStr = value?.max ? `${value.max}` : '';
            return `${minStr} - ${maxStr} mins`;
        }
        return '';
    },
    parseInitialFilterValue: (browserQueryUrlValue: string) => {
        return browserQueryUrlValue ? getMinMaxFromKey(browserQueryUrlValue) : null;
    },
    renderComponent: ({ value, update }) => <MinMaxInput onChange={update} value={value} allowNegativeInput={false} />
});

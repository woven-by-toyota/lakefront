import { FilterModule } from 'src/components/Filter/types';
import DateRangeInput, { DateRange } from 'src/stories/Filter/DateRangeFilter/DateRangeInput';

export interface DateRangeFilterProps {
    label: string;
    description?: string;
}

export const DateRangeFilter = ({ label, description }: DateRangeFilterProps): FilterModule<DateRange> => ({
    label,
    description,
    // Use splitQueryParams to tell the filter system that this filter uses multiple query params
    splitQueryParams: ['startDate', 'endDate'],
    getApiQueryUrl: (key, value) => {
        let urlString = '';
        if (value?.startDate) {
            urlString += `&startDate=${value.startDate}`;
        }
        if (value?.endDate) {
            urlString += `&endDate=${value.endDate}`;
        }
        return urlString;
    },
    getApiPostBody: (key, value) => {
        if (value) {
            const postBody: any = {};
            if (value.startDate) {
                postBody.startDate = value.startDate;
            }
            if (value.endDate) {
                postBody.endDate = value.endDate;
            }
            return postBody;
        }

        return undefined;
    },
    getBrowserQueryUrlValue: value => {
        // Return the value object directly - the filter system will handle splitting it
        return value || {};
    },
    getDefaultFilterValue: () => null,
    isDefaultFilterValue: value => value === null,
    getFilterBarLabel: value => {
        if (value) {
            const startStr = value?.startDate ? `${value.startDate}` : '';
            const endStr = value?.endDate ? `${value.endDate}` : '';
            return `Date Range: ${startStr} - ${endStr}`;
        }
        return '';
    },
    getFilterSectionLabel: value => {
        if (value) {
            const startStr = value?.startDate ? `${value.startDate}` : '';
            const endStr = value?.endDate ? `${value.endDate}` : '';
            return `${startStr} - ${endStr}`;
        }
        return '';
    },
    parseInitialFilterValue: (incomingParams: any) => {
        // When splitQueryParams is used, this receives an object with the split params
        if (typeof incomingParams === 'object' && (incomingParams.startDate || incomingParams.endDate)) {
            return {
                startDate: incomingParams.startDate as string,
                endDate: incomingParams.endDate as string
            };
        }
        return null;
    },
    renderComponent: ({ value, update }) => <DateRangeInput onChange={update} value={value} />
});

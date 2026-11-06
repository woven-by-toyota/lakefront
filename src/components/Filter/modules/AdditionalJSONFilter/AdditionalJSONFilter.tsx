import type { AdditionalJSONFilterOptions, FilterModule } from 'src/components/Filter/types';
import type { JSONObject } from 'src/types/global';
import {
    ADDITIONAL_JSON_FILTER_BAR_LABEL,
    ADDITIONAL_JSON_FILTER_LABEL,
    isActualValue
} from './additionalJSONFilterUtil';

/**
 * AdditionalJSONFilter Component
 *
 * The AdditionalJSONFilter component is a "pseudo" filter used in Filter JSON input to track additional,
 * user-supplied JSON values which have no equivalent UI filter to represent them.
 * It acts like any other filter, in that is is able to parse its own value from a query string,
 * serialize to a query string, and show a filter chip label in the Filter Bar,
 * but it has (by default) `inputHidden` set to true which causes it to not render any UI in the filter drawer.
 *
 * This filter (by default) intentionally does not implement getFilterValueFromApiPostBody, because the useFilter hook
 * sets this filter's value based on the JSON "leftover" after all the other filters parse their values from JSON.
 */
const AdditionalJSONFilter = (
    additionalJSONFilterOptions: AdditionalJSONFilterOptions = {}
): FilterModule<JSONObject> => ({
    label: ADDITIONAL_JSON_FILTER_LABEL,
    inputHidden: true,
    getApiQueryUrl: () => '',
    getApiPostBody: (_, value) => value,
    getBrowserQueryUrlValue: (value) => (isActualValue(value) ? JSON.stringify(value) : undefined),
    getDefaultFilterValue: () => undefined,
    isDefaultFilterValue: (value) => !isActualValue(value),
    getFilterBarLabel: (value) => (value ? ADDITIONAL_JSON_FILTER_BAR_LABEL : ''),
    getFilterSectionLabel: (value) => (value ? ADDITIONAL_JSON_FILTER_BAR_LABEL : ''),
    parseInitialFilterValue: (browserQueryUrlValue: string) => {
        return browserQueryUrlValue ? JSON.parse(browserQueryUrlValue) : undefined;
    },
    renderComponent: () => <></>,
    ...additionalJSONFilterOptions
});

export default AdditionalJSONFilter;

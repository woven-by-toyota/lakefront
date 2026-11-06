import type { FC } from 'react';
import type { AdditionalJSONFilterOptions } from 'src/components/Filter/types';
import { createFilterSourceCode } from 'src/stories/Filter/filterStoriesUtil';

export interface AdditionalJSONFilterArgs {
    /**
     * `AdditionalJSONFilterOptions` is any valid `FilterModule` property
     * meant to override default additional JSON filter behaviour.
     */
    additionalJSONFilterOptions?: AdditionalJSONFilterOptions;
}

/**
 * Example of additional JSON filter source code.
 */
export const ADDITIONAL_JSON_SELECT_FILTER_SOURCE_CODE = createFilterSourceCode(`{
    additionalJSONFilter: AdditionalJSONFilter(
        {
            label: 'Additional JSON Filter',
            inputHidden: false,
            description: 'AdditionalJSONFilter is normally hidden, but can be overriden to display ui.',
            getApiQueryUrl: (key: string, value: { additionalJSONFilter: number }) => {
                return value?.additionalJSONFilter ? \`&\${key}=\${encodeURIComponent(value.additionalJSONFilter)}\` : '';
            },
            getDefaultFilterValue: () => ({ additionalJSONFilter: 1 }),
            parseInitialFilterValue: () => ({ additionalJSONFilter: 1 }),
            isDefaultFilterValue: () => false,
            ...additionalAdditionalJSONFilterOptions
        }
    )
}`);

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
const AdditionalJSONFilterDocs: FC<AdditionalJSONFilterArgs> = () => null;

export default AdditionalJSONFilterDocs;

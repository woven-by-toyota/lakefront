import type { FC } from 'react';
import type { SingleSelectFilterOptions, SingleSelectFilterProps } from 'src/components/Filter/types';
import { createFilterSourceCode } from 'src/stories/Filter/filterStoriesUtil';

export interface SingleSelectFilterArgs {
    /**
     * The props required to be supplied as the first argument of
     * the SingleSelectFilter component.
     */
    singleSelectFilterProps: SingleSelectFilterProps;
    /**
     * Any valid `FilterModule` property (excluding description, label, and required)
     * which will override default single select filter behaviour.
     */
    singleSelectFilterOptions?: SingleSelectFilterOptions;
}

/**
 * Example of single select filter source code.
 */
export const SINGLE_SELECT_FILTER_SOURCE_CODE = createFilterSourceCode(`{
    singleSelectFilter: SingleSelectFilter(
        {
            label: 'Single Select Filter',
            selectPlaceholderLabel: 'Select a color',
            filterLabelPrefix: 'Single Select Filter', 
            options: [
                { label: 'Red', value: 'red' },
                ...additionalSelectOptions
            ],
            description: 'SingleSelectFilter is a select dropdown control meant to single select a value.'
        },
        {
            ...additionalSingleSelectFilterOptions
        }
    )
}`);

/**
 * SingleSelectFilter Component
 *
 * The SingleSelectFilter component is a single select dropdown filter. While the default
 * behaviour should suffice, any valid `FilterModule` property (excluding description, label, and required) can
 * be supplied via the `singleSelectFilterOptions` parameter to change how the filter looks and acts.
 * SingleSelectFilter arguments include:
 *
 * `singleSelectFilterProps` - The props required to be supplied as the first argument of
 * the SingleSelectFilter component.
 *
 * `singleSelectFilterOptions` - Any valid `FilterModule` property (excluding description, label, and required)
 * meant to override default text filter behaviour.
 */
const SingleSelectFilterDocs: FC<SingleSelectFilterArgs> = () => null;

export default SingleSelectFilterDocs;

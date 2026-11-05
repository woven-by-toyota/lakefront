import type { FC } from 'react';
import type { MultiSelectFilterOptions, MultiSelectFilterProps } from 'src/components/Filter/types';
import { createFilterSourceCode } from 'src/stories/Filter/filterStoriesUtil';

export interface MultiSelectFilterArgs {
    /**
     * The props required to be supplied as the first argument of
     * the MultiSelectFilter component. If the *optional* `delimiter` prop is provided, input parsing
     * will be enabled to allow typing/pasting multiple values seperated by the chosen delimiter.
     */
     multiSelectFilterProps: MultiSelectFilterProps;
    /**
     * Any valid `FilterModule` property (excluding description and label)
     * which will override default multi select filter behaviour.
     */
    multiSelectFilterOptions?: MultiSelectFilterOptions;
}

/**
 * Example of multi select filter source code.
 */
 export const MULTI_SELECT_FILTER_SOURCE_CODE = createFilterSourceCode(`{
    multiSelectFilter: MultiSelectFilter(
        {
            label: 'Multi Select Filter',
            creatable: true,
            initialValue = ['colors'],
            options: [
                { label: 'Colors', value: 'colors' },
                ...additionalSelectOptions
            ],
            description: 'MultiSelectFilter is a select dropdown control meant to multi select a value.'
        },
        {
            getDefaultFilterValue: () => ['colors']
            ...additionalMultiSelectFilterOptions
        }
    )
}`);

/**
 * MultiSelectFilter Component
 * 
 * The MultiSelectFilter component is a multi select dropdown filter. While the default
 * behaviour should suffice, any valid `FilterModule` property (excluding description and label) can
 * be supplied via the `multiSelectFilterOptions` parameter to change how the filter looks and acts.
 * MultiSelectFilter arguments include:
 *
 * `multiSelectFilterProps` - The props required to be supplied as the first argument of
 * the MultiSelectFilter component. If the *optional* `delimiter` prop is provided, input parsing
 * will be enabled to allow typing/pasting multiple values seperated by the chosen delimiter.
 *
 * `multiSelectFilterOptions` - Any valid `FilterModule` property (excluding description and label)
 * meant to override default text filter behaviour.
 */
const MultiSelectFilterDocs: FC<MultiSelectFilterArgs> = () => null;

export default MultiSelectFilterDocs;

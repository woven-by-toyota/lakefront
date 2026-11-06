import type { FC } from 'react';
import type { DoubleMultiSelectFilterOptions, DoubleMultiSelectFilterProps } from 'src/components/Filter/types';
import { createFilterSourceCode } from 'src/stories/Filter/filterStoriesUtil';

export interface DoubleMultiSelectFilterArgs {
    /**
     * The props required to be supplied as the first argument of
     * the MultiSelectFilter component.
     */
    doubleMultiSelectFilterProps: DoubleMultiSelectFilterProps;
    /**
     * Any valid `FilterModule` property (excluding description and label)
     * which will override default multi select filter behaviour.
     */
    doubleMultiSelectFilterOptions?: DoubleMultiSelectFilterOptions;
}

/**
 * Example of double multi select filter source code.
 */
export const DOUBLE_MULTI_SELECT_FILTER_SOURCE_CODE = createFilterSourceCode(`{
    doubleMultiSelectFilter: DoubleMultiSelectFilterArgs(
        {
            label: 'Double Multi Select Filter',
            selectOptions: {
                firstSelect: {
                    apiField: 'first',
                    label: 'First Filter',
                    name: 'first',
                    creatable: true,
                    items: [],
                    placeholder: 'Type or paste',
                    disableMenu: true,
                    barLabel: 'First Filter'
                },
                secondSelect: {
                    apiField: 'second',
                    label: 'Second Filter',
                    name: 'second',
                    creatable: true,
                    items: [],
                    placeholder: 'Type or paste',
                    disableMenu: true,
                    barLabel: 'Second Filter'
                }
            }
        }
    )
}`);

/**
 * DoubleMultiSelectFilter Component
 *
 * The DoubleMultiSelectFilter component is a pair of multi select dropdown filters. While the default
 * behaviour should suffice, any valid `FilterModule` property (excluding description and label) can
 * be supplied via the `doubleMultiSelectFilterOptions` parameter to change how the filter looks and acts.
 * DoubleMultiSelectFilter arguments include:
 *
 * `doubleMultiSelectFilterProps` - The props required to be supplied as the first argument of
 * the DoubleMultiSelectFilter component.
 *
 * `doubleMultiSelectFilterOptions` - Any valid `FilterModule` property (excluding description and label)
 * meant to override default text filter behaviour.
 */
const DoubleMultiSelectFilterDocs: FC<DoubleMultiSelectFilterArgs> = () => null;

export default DoubleMultiSelectFilterDocs;

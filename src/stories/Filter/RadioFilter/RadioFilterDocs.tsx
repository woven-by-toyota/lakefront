import type { FC } from 'react';
import type { RadioFilterOptions, RadioFilterProps } from 'src/components/Filter/types';
import { createFilterSourceCode } from 'src/stories/Filter/filterStoriesUtil';

export interface RadioFilterArgs {
    /**
     * The props required to be supplied as the first argument of
     * the RadioFilter component.
     */
    radioFilterProps: RadioFilterProps;
    /**
     * Any valid `FilterModule` property (excluding description and label)
     * which will override default radio filter behaviour.
     */
    radioFilterOptions?: RadioFilterOptions;
}

/**
 * Example of radio filter source code.
 */
export const RADIO_FILTER_SOURCE_CODE = createFilterSourceCode(`{
    radioFilter: RadioFilter(
        {
            label: 'Radio Filter',
            initialValue: 'north',
            defaultValue: '',
            options: [
                { label: 'North', value: 'north' },
                ...additionalRadioGroupOptions
            ],
            description: 'RadioFilter is a radio group control meant to single select a value.'
        },
        {
            getFilterBarLabel: (value: string) => \`Radio Filter: \${value}\`,
            ...additionalRadioFilterOptions
        }
    )
}`);

/**
 * RadioFilter Component
 *
 * The RadioFilter component is a filter by use of radio group. While the default
 * behaviour should suffice, any valid `FilterModule` property (excluding label) can
 * be supplied via the `radioFilterOptions` parameter to change how the filter looks and acts.
 */
const RadioFilterDocs: FC<RadioFilterArgs> = () => null;

export default RadioFilterDocs;

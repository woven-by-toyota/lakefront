import type { FC } from 'react';
import type { CheckboxGroupOption } from 'src/components/CheckboxGroup/CheckboxGroup';
import type { ListFilterOptions } from 'src/components/Filter/modules/ListFilter/ListFilter';
import type { ListFilterOverrides } from 'src/components/Filter/types';
import { createFilterSourceCode } from 'src/stories/Filter/filterStoriesUtil';

export interface ListFilterArgs {
    /**
     * Array of objects for the checkboxes to show for the filter.
     */
    options: CheckboxGroupOption[];
    /**
     * The label to display for the text filter component.
     */
    label: string;
    /**
     * The description/help text to display above the text filter component.
     */
    description?: string;
    /**
     * Additional options for the list filter settings.
     */
    listFilterOptions: ListFilterOptions;
    /**
     * Additional options for the list filter behavior.
     */
    listFilterOverrides: ListFilterOverrides;
}

/**
 * Example of list filter source code.
 */
export const LIST_FILTER_SOURCE_CODE = createFilterSourceCode(`{
    listFilter: ListFilter(
        [{ label: 'First', value: 'first' }, { label: 'Second', value: 'second' }],
        'List Filter',
        'ListFilter is a checkbox group control meant to be used for filtering specific items in a set. (Tab or Enter to apply)',
        {
            allLabel: 'Custom All Label Text',
            initialValue: 'first'
        },
        {
            getDefaultFilterValue: () => '',
            ...additionalListFilterOptions
        }
    )
}`);

/**
 * ListFilter Component
 *
 * The ListFilter component is a checkbox control meant to be used for filtering specific items in a set. While the default
 * behaviour should suffice, any valid `FilterModule` property (excluding description and label) can
 * be supplied via the `listFilterOverrides` parameter to change how the filter looks and acts as well as the
 * `listFilterOptions` to set additional properties related to the list filter itself.
 *
 * `label` - The label to display for the text filter component.
 *
 * `description` - The description/help text to display above the text filter component.
 *
 * `listFilterOptions` - Used to set additional listFilter options such as the allLabel and initialValue.
 *
 * `listFilterOverrides` - Any valid `FilterModule` property (excluding description and label)
 * which will override default text filter behaviour.
 */
const ListFilterDocs: FC<ListFilterArgs> = () => null;

export default ListFilterDocs;

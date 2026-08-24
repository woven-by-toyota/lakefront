import { FC } from 'react';
import { TextFilterOverrides } from 'src/components/Filter/types';
import { TextFilterOptions } from 'src/components/Filter/modules/TextFilter/TextFilter';
import { createFilterSourceCode } from 'src/stories/Filter/filterStoriesUtil';

export interface TextFilterArgs {
    /**
     * The label to display for the text filter component.
     */
    label: string;
    /**
     * The description/help text to display above the text filter component.
     */
    description?: string;
    /**
     * Any valid `FilterModule` property (excluding description and label)
     * which will override default text filter behaviour.
     */
     textFilterOverrides?: TextFilterOverrides;
    /**
     * Additional options for the text filter settings.
     */
    textFilterOptions: TextFilterOptions;
}

/**
 * Example of text filter source code.
 */
 export const TEXT_FILTER_SOURCE_CODE = createFilterSourceCode(`{
    textFilter: TextFilter(
        'Text Filter',
        'TextFilter is a text input control meant to be used as a keyword(s) search. (Tab or Enter to apply)',
        {
            getDefaultFilterValue: () => '',
            ...additionalTextFilterOverrides
        },
        {
            type: 'text',
            trimWhitespace: true
        },
    )
}`);

/**
 * TextFilter Component
 * 
 * The TextFilter component is a text input control meant to be used as a keyword(s) search. While the default
 * behavior should suffice, any valid `FilterModule` property (excluding description and label) can
 * be supplied via the `textFilterOverrides` parameter to change how the filter looks and acts.
 *
 * Leading/trailing whitespace is trimmed when the search is submitted. Set the `trimWhitespace` text filter
 * option to `false` to keep it.
 */
const TextFilterDocs: FC<TextFilterArgs> = () => null;

export default TextFilterDocs;

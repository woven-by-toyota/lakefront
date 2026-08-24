import TextSearch from './TextSearch';
import { FilterModule, TextFilterOverrides } from 'src/components/Filter/types';

export interface TextFilterOptions {
    type?: 'text' | 'number';
    trimWhitespace?: boolean;
}

/**
 * TextFilter Component
 * 
 * The TextFilter component is a text input control meant to be used as a keyword(s) search. While the default
 * behaviour should suffice, any valid `FilterModule` property (excluding description and label) can
 * be supplied via the `textFilterOverrides` parameter to change how the filter looks and acts. TextFilter arguments include:
 * 
 * `label` - The label to display for the text filter component.
 * 
 * `description` - The description/help text to display above the text filter component.
 * 
 * `textFilterOverrides` - Any valid `FilterModule` property (excluding description and label)
 * which will override default text filter behaviour.
 * 
 * `textFilterOptions` - Used to set additional textFilter options such as the type of text input and whether
 * leading/trailing whitespace is trimmed (`trimWhitespace`, which defaults to `true`).
 */
const TextFilter = (
    label: string,
    description?: string,
    textFilterOverrides: TextFilterOverrides = {},
    textFilterOptions: TextFilterOptions = {}
): FilterModule<string> => {
    const { trimWhitespace = true } = textFilterOptions;

    // Leading/trailing whitespace is rarely intended as part of a search term and often causes
    // requests to return no results, so it is removed unless the consumer opts out.
    const trim = (value?: string) => (trimWhitespace && typeof value === 'string' ? value.trim() : value);

    return {
        getApiQueryUrl: (key, value) => {
            const trimmedValue = trim(value);

            return trimmedValue ? `&${key}=${encodeURIComponent(trimmedValue)}` : '';
        },
        getApiPostBody: (key, value) => {
            const trimmedValue = trim(value);

            return trimmedValue ? { [key]: trimmedValue } : undefined;
        },
        getBrowserQueryUrlValue: (value) => trim(value),
        getDefaultFilterValue: () => '',
        isDefaultFilterValue: (value) => trim(value) === '',
        getFilterBarLabel: (value) => value,
        getFilterSectionLabel: (value) => value,
        parseInitialFilterValue: (browserQueryUrlValue: string) => trim(browserQueryUrlValue) || '',
        renderComponent: ({ name, value, update }) => (
            <TextSearch
                key={name}
                onChange={update}
                value={value}
                type={textFilterOptions.type}
                trimWhitespace={trimWhitespace}
            />
        ),
        getFilterCount(value?: string): number {
            return trim(value) ? 1 : 0;
        },
        ...textFilterOverrides,
        description,
        label
    };
};

export default TextFilter;


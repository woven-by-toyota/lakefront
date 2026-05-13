import { getUrlFromList } from 'src/components/Filter/util/filterUtil';
import MultiSelect from './MultiSelect';
import { FilterModule, MultiSelectFilterProps, MultiSelectFilterOptions } from 'src/components/Filter/types';

const INITIAL_VALUE: [] = [];

/**
 * MultiSelectFilter Component
 * 
 * The MultiSelectFilter component is a multi select dropdown filter. While the default
 * behavior should suffice, any valid `FilterModule` property (excluding description and label) can
 * be supplied via the `multiSelectFilterOptions` parameter to change how the filter looks and acts.
 * MultiSelectFilter arguments include:
 *
 * `multiSelectFilterProps` - The props required to be supplied as the first argument of
 * the MultiSelectFilter component. If the *optional* `delimiter` prop is provided, input parsing
 * will be enabled to allow typing/pasting multiple values separated by the chosen delimiter.
 *
 * `multiSelectFilterOptions` - Any valid `FilterModule` property (excluding description and label)
 * meant to override default text filter behavior.
 */
const MultiSelectFilter = (
    {
        options,
        label,
        description,
        initialValue = INITIAL_VALUE,
        creatable = false,
        disableMenu = false,
        handleCreateItem,
        delimiter
    }: MultiSelectFilterProps,
    multiSelectFilterOptions: MultiSelectFilterOptions = {}
): FilterModule<string[]> => ({
    getFilterCount: (value) => value?.length ?? 0,
    getApiQueryUrl: (key, value) => {
        if (value) {
            return getUrlFromList(key, value, options.length);
        }
        return '';
    },
    getApiPostBody: (key, value) => {
        if (value && value.length > 0) {
            return { [key]: value };
        } else {
            // don't apply any post body when there are no values set
            return undefined;
        }
    },
    getBrowserQueryUrlValue: (value) => value,
    getDefaultFilterValue: () => initialValue !== INITIAL_VALUE ? initialValue : [],
    clearPartialSingleFilter: (originalValue, value) => originalValue.filter((original) => original !== value),
    isDefaultFilterValue: (value) => {
        // No custom initialValue provided - default is empty array or all options selected
        if (value && initialValue === INITIAL_VALUE) {
            if (value.length === 0) {
                return true;
            }
            return value.length === options.length;
        }

        // Custom initialValue provided - match against that value
        if (value && initialValue !== INITIAL_VALUE) {
            return value.length === initialValue.length &&
                   value.every((v: string) => initialValue.includes(v));
        }

        return false;
    },
    getFilterBarLabel: (values) => {
        if (values) {
            if (!Array.isArray(values)) {
                return '';
            }

            const filterValues = values.map((value) => {
                const valueLabel = options.find((option) => option.value === value);
                if (valueLabel) {
                    const pos = valueLabel.label.indexOf('[');
                    if (pos > 0) {
                        return valueLabel.label.substring(0, pos).trim();
                    }
                    return valueLabel.label;
                }
                return value;
            });

            return `${label}: ${filterValues.toString()}`;
        }

        return '';
    },
    getFilterSectionLabel: (values) => {
        if (values) {
            if (!Array.isArray(values)) {
                return [];
            }

            const filterValues = values.map((value) => {
                const valueLabel = options.find((option) => option.value === value);
                if (valueLabel) {
                    const pos = valueLabel.label.indexOf('[');
                    if (pos > 0) {
                        return valueLabel.label.substring(0, pos).trim();
                    }
                    return valueLabel.label;
                }
                return value;
            });

            return filterValues;
        }

        return [];
    },
    parseInitialFilterValue: (browserQueryUrlValue) => {
        if (browserQueryUrlValue) {
            return typeof browserQueryUrlValue === 'string' ? [browserQueryUrlValue] : browserQueryUrlValue;
        }
        if (initialValue !== INITIAL_VALUE) {
            return typeof initialValue === 'string' ? [initialValue] : initialValue;
        }

        return [];
    },
    renderComponent: ({ name, value, update }) => {
        const selected = value.map((item) => ({
            label: item,
            value: item
        }));

        return (
            <MultiSelect
                key={name}
                creatable={creatable}
                handleCreateItem={handleCreateItem}
                items={options}
                value={selected}
                selectItem={update}
                title={name}
                disableMenu={disableMenu}
                delimiter={delimiter}
            />
        );
    },
    ...multiSelectFilterOptions,
    description,
    label
});

export default MultiSelectFilter;

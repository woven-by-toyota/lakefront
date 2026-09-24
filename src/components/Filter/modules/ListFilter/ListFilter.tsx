import { areSetsEqual, getUrlFromList } from 'src/components/Filter/util/filterUtil';
import CheckboxGroup, { CheckboxGroupOption } from 'src/components/CheckboxGroup/CheckboxGroup';
import { FilterModule, ListFilterOverrides } from 'src/components/Filter/types';

export interface ListFilterOptions {
    allLabel?: string;
    initialValue?: string | any[];
}

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
const ListFilter = (
    options: CheckboxGroupOption[],
    label: string,
    description?: string,
    listFilterOptions: ListFilterOptions = {},
    listFilterOverrides: ListFilterOverrides = {}
): FilterModule<Set<string>> => ({
    getFilterCount: (value) => value?.size ?? 0,
    getApiQueryUrl: (key, value) => {
        if (value) {
            return getUrlFromList(key, value, options.length, Boolean(listFilterOptions.initialValue));
        }
        return '';
    },
    getApiPostBody: (key, value) => {
        if (value && value.size > 0) {
            return { [key]: Array.from(value) };
        } else {
            // don't apply any post body when there are no values set
            return undefined;
        }
    },
    getBrowserQueryUrlValue: value => value && Array.from(value),
    getDefaultFilterValue: () => listFilterOptions.initialValue ?
        new Set([listFilterOptions.initialValue].flat()) :
        new Set(options.map(item => item.value)),
    isDefaultFilterValue: value => {
        if (value && !listFilterOptions.initialValue) {
            if (value.size === 0) {
                return true;
            }
            return value.size === options.length;
        }
        if (value && listFilterOptions.initialValue) {
            const initialValueSet = new Set([listFilterOptions.initialValue].flat());

            return areSetsEqual(initialValueSet, value);
        }
        return false;
    },
    clearPartialSingleFilter: (originalValue, selectedValue) => {
        const copySetValues = new Set(originalValue);
        copySetValues.delete(selectedValue);

        return copySetValues;
    },
    getFilterBarLabel: value => {
        if (value) {
            return Array.from(value)
                .map(item => {
                    const itemLabel = options.find(i => i.value === item);
                    return itemLabel?.label;
                })
                .toString();
        }
        return '';
    },
    getFilterSectionLabel: value => {
        if (value) {
            return Array.from(value)
                .map(item => {
                    const itemLabel = options.find(i => i.value === item);
                    return String(itemLabel?.label);
                });
        }
        return [];
    },
    getFilterSectionValues: value => (value ? Array.from(value) : []),
    parseInitialFilterValue: browserQueryUrlValue => {
        if (browserQueryUrlValue) {
            // initial value is either a single string or array of strings
            return typeof browserQueryUrlValue === 'string' ?
                new Set([browserQueryUrlValue]) :
                new Set(browserQueryUrlValue);
        }
        if (listFilterOptions.initialValue?.length) {
            const { initialValue } = listFilterOptions;
            const initialFilterValue = typeof initialValue === 'string' ? [initialValue] : initialValue;

            return new Set(initialFilterValue);
        }
        return new Set(options.map(item => item.value));
    },
    renderComponent: ({ name, value, update }) => (
        <CheckboxGroup
            key={name}
            onHandleChange={update}
            name={name}
            options={options}
            selected={value}
            allLabel={listFilterOptions.allLabel}
        />
    ),
    ...listFilterOverrides,
    label,
    description
});

export default ListFilter;

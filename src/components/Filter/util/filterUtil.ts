import { humanizeCamelCase } from 'src/lib/format.js';
import type { SelectOption } from 'src/types/global';
import { FilterMode, type FilterSet, type FilterValues, type UrlParameters } from '../types';

/**
 * FILTER_MODE_OPTIONS
 */
export const FILTER_MODE_OPTIONS = new Map([
    [FilterMode.FilterUI, 'Filter Results'],
    [FilterMode.JSON, 'Filter by JSON']
]);

/**
 * Constant user JSON query parameter.
 */
export const USER_JSON_QUERY_PARAM = 'userJSON';

/**
 * Returns the default value or fallback value of a requested url parameter.
 */
export const getDefaultValue = (urlParams: UrlParameters, key: string, defaultValue: any) => {
    if (urlParams[key]) {
        return Array.isArray(urlParams[key]) ? urlParams[key]?.[0] : urlParams[key];
    }

    return defaultValue;
};

/**
 * Returns the default value of `jsonView` parameter.
 */
export const getDefaultJsonViewValue = (urlParams: UrlParameters) => {
    const val = getDefaultValue(urlParams, 'jsonView', false);

    // value will be a string if provided as a query string
    return val === 'true';
};

/**
 * Gets the count of applied filters.
 */
export const getFilterAppliedCount = (filters: FilterSet, filterValues: FilterValues) => {
    let count = 0;
    Object.keys(filters).forEach((key) => {
        if (!filters[key].isDefaultFilterValue(filterValues[key]) && !filters[key].required) {
            count++;
        }
    });
    return count;
};

/**
 * Given a list (Array or Set) of string, return a query string representation.
 * Default behavior is that when all items are selected, nothing is returned.
 */
export const getUrlFromList = (
    name: string,
    list: string[] | Set<string>,
    count: number,
    hasInitialValue: boolean = false
) => {
    const listSize = Array.isArray(list) ? list.length : list.size;

    // if all items in list selected, pass empty string in url filter
    if ((listSize === count || listSize === 0) && !hasInitialValue) {
        return '';
    }

    const url = new URLSearchParams();

    for (const item of list) {
        url.append(name, item);
    }
    return `&${url}`;
};

// compare Set values
export const areSetsEqual = (xs: Set<string>, ys: Set<string>) => {
    return xs.size === ys.size && [...xs].every((x) => ys.has(x));
};

export const convertToFilterDropdownOptions = (filterMapping?: { [key: string]: any }): SelectOption<string>[] => {
    if (!filterMapping) {
        return [];
    }

    const filterNames = Object.keys(filterMapping);

    return filterNames.map((value) => ({
        label: humanizeCamelCase(value),
        value
    }));
};

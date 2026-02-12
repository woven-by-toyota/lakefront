import { useState, useEffect, useMemo } from 'react';
import queryString from 'query-string';

import { AdditionalJSONFilter } from '../modules';
import { FilterHooks, FilterPostBody, FilterSet, FilterValues, Location, UpdateHistory } from '../types';
import { USER_JSON_QUERY_PARAM } from './filterUtil';
import {
    getApiQueryUrl,
    getApiPostBody,
    getCurrentBrowserQueryParams,
    getFilterBrowserQueryParams,
    parseInitialFilterValues
} from './filterHooksUtil';

/**
 * The useFilter hook is primarily designed to use with the Filter
 * component, but can be used standalone to maintain filter state.
 * The state as it applies to the current url and a dynamic api post body
 * can be updated and/or reset using this hook.
 */
export const useFilter = <T extends FilterPostBody>(
    userFilters: FilterSet,
    supportJSON = false,
    location: Location,
    updateHistory: UpdateHistory
): FilterHooks<T> => {
    const filters = useMemo(() => {
        return supportJSON ? { ...userFilters, [USER_JSON_QUERY_PARAM]: AdditionalJSONFilter() } : userFilters;
    }, [supportJSON, userFilters]);

    const [filterValues, setFilterValues] = useState(parseInitialFilterValues(location, filters));
    const filterUrl = useMemo(() => getApiQueryUrl(filters, filterValues), [filters, filterValues]);
    const filterPostBody = useMemo(() => getApiPostBody<T>(filters, filterValues), [filters, filterValues]);
    const [presetValues, setInitialPresetValues] = useState({});

    // initialize the filter values based on url params and default values
    useEffect(() => {
        const initialFilterValues = parseInitialFilterValues(location, filters, presetValues);
        setFilterValues(initialFilterValues);
    }, [filters, presetValues]);

    // update the filter values in the state, and update the browser url
    const updateFilterValues = (values: FilterValues) => {
        setFilterValues(values);
        // capture splitQueryParams if exists to clear those as well
        const splitFilters = Object
          .values(filters)
          .filter(filter => filter.splitQueryParams)
          .map(filter => filter.splitQueryParams)
          .flat() as string[];
        const nonFilterQueryParams = getCurrentBrowserQueryParams(location, [...Object.keys(filters), ...splitFilters]);
        const filterQueryParams = getFilterBrowserQueryParams(filters, values);
        const newQueryParams = { ...nonFilterQueryParams, ...filterQueryParams };
        updateHistory({ search: queryString.stringify(newQueryParams) });
    };

    const updateFilter = (name: string, value: any) => {
        updateFilterValues({
            ...filterValues,
            [name]: value
        });
    };


    const resetFilter = (name: string, value?: any) => {
        const clearPartial = filters[name].clearPartialSingleFilter;

        if (value && clearPartial) {
            const singleFilterValue = clearPartial(filterValues[name], value);

            updateFilterValues({
                ...filterValues,
                [name]: singleFilterValue
            });
            return;
        }

        // required filters are not cleared or reset
        if (!filters[name].required) {
            const defaultValue = filters[name].getDefaultFilterValue();

            updateFilterValues({
                ...filterValues,
                [name]: defaultValue
            });
        }
    };

    const initializePresetValues = (presetValues: { [key: string]: any; }) => {
        setInitialPresetValues(presetValues);
    };

    const resetAllFilters = () => {
        const newFilterValues: FilterValues = {};

        Object.keys(filters).forEach((key) => {
            // required filters are not cleared or reset
            if (filters[key].required) {
                newFilterValues[key] = filterValues[key];
            } else {
                newFilterValues[key] = filters[key].getDefaultFilterValue();
            }
        });

        updateFilterValues(newFilterValues);
    };

    const applyApiPostBody = (apiPostBody: T) => {
        if (supportJSON) {
            const newFilterValues: FilterValues = {};

            Object.keys(filters).forEach((key) => {
                const getFilterValueFromApiPostBody = filters[key].getFilterValueFromApiPostBody;
                if (getFilterValueFromApiPostBody) {
                    newFilterValues[key] = getFilterValueFromApiPostBody(key, apiPostBody);
                }
            });

            // Each filter's getFilterValueFromApiPostBody() call removes the parsed section when complete, so that
            // the remaining post body represents "leftover" JSON that doesn't correspond to any filter. Set the
            // "additional JSON filter" to this leftover value so it can also be displayed as a chip or dismissed.
            newFilterValues[USER_JSON_QUERY_PARAM] = apiPostBody;

            updateFilterValues(newFilterValues);
        }
    };

    return {
        filters,
        filterUrl,
        filterPostBody,
        filterValues,
        updateFilter,
        resetFilter,
        resetAllFilters,
        applyApiPostBody,
        initializePresetValues
    };
};

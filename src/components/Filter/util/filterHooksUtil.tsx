import queryString, { ParsedQuery } from 'query-string';
import { FilterPostBody, FilterSet, FilterValues, Location, UrlParameters } from '../types';

/**
 * Return the filter query string to be appended to API endpoint URL.
 */
export const getApiQueryUrl = (filters: FilterSet, filterValues: FilterValues): string => {
    let filterUrl = '';

    Object.keys(filters).forEach((key) => {
        const filter = filters[key];
        filterUrl += filter.getApiQueryUrl(key, filterValues[key]);
    });

    return filterUrl;
};

/**
 * Return the filter post body to be passed for POST api calls.
 */
export const getApiPostBody = <T extends FilterPostBody = {}>(filters: FilterSet, filterValues: FilterValues): T => {
    return Object.entries(filters).reduce(
        (body, [key, filter]) => ({
            ...body,
            ...filter.getApiPostBody(key, filterValues[key])
        }),
        {}
    ) as T;
};

/**
 * Parse filter values from browser url query param values to
 * pre-populate filter values on init.
 */
export const parseInitialFilterValues = (location: Location, filters: FilterSet, presetValues?: {
  [key: string]: any;
}): FilterValues => {
  const urlParams = queryString.parse(location.search) as UrlParameters;
  const initialFilterValues: FilterValues = {};

  Object.keys(filters).forEach((key) => {
    const filter = filters[key];

    // special case for filters that use multiple query params to save their value, such as the date range filter
    if (filter?.splitQueryParams) {
      const incomingParamValues = filter.splitQueryParams.reduce((acc, paramKey) => {
        acc[paramKey] = urlParams[paramKey];
        return acc;
      }, {} as Record<string, string | string[] | null>);

      initialFilterValues[key] = filter.parseInitialFilterValue(incomingParamValues);
      return;
    }

    initialFilterValues[key] = filter.parseInitialFilterValue(urlParams[key]);
  });

  return { ...initialFilterValues, ...presetValues };
};

/**
 * Get current browser query params, optionally excluding the supplied keys.
 */
export const getCurrentBrowserQueryParams = (location: Location, excludeKeys?: string[]): ParsedQuery => {
    const currentUrlParams = queryString.parse(location.search);

    if (excludeKeys) {
        excludeKeys.forEach((key) => {
            delete currentUrlParams[key];
        });
    }

    return currentUrlParams;
};

/**
 * Get browser query params to save in browser address bar
 * using current filter values. **Note: Each filter value can be any valid object
 * of type `Record<string, any>` as it will be stringified in the useFilter hook using the query-string library
 * defaults (https://github.com/sindresorhus/query-string)**.
 */
export const getFilterBrowserQueryParams = (filters: FilterSet, values: FilterValues): ParsedQuery => {
    const urlValues: FilterValues = {};

    Object.keys(filters).forEach((key) => {
        // only save filter url if it's not a default value or it's a time range
        if (!filters[key].isDefaultFilterValue(values[key]) || key === 'dateRange') {
            const filter = filters[key];
            const urlValue = filter.getBrowserQueryUrlValue(values[key]);

            // filters that store their value across multiple query params (e.g. a date range's
            // startDate/endDate) return an object keyed by those params, which must be merged in
            // under their own names rather than under this filter's key.
            if (filter.splitQueryParams) {
                filter.splitQueryParams.forEach((paramKey) => {
                    const paramValue = (urlValue as Record<string, unknown> | null | undefined)?.[paramKey];
                    const isEmpty = paramValue == null || paramValue === '' || (Array.isArray(paramValue) && paramValue.length === 0);

                    if (!isEmpty) {
                        urlValues[paramKey] = paramValue;
                    }
                });
                return;
            }

            urlValues[key] = urlValue;
        }
    });

    return urlValues;
};

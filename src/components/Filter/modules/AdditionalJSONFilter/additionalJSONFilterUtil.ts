/**
 * The default additional JSON filter label
 */
export const ADDITIONAL_JSON_FILTER_LABEL = 'Additional JSON';

/**
 * The default additional JSON filter bar label
 */
export const ADDITIONAL_JSON_FILTER_BAR_LABEL = 'Additional JSON Filters';

/**
 * isActualValue determines if the provided value
 * is truthy and is non-empty.
 */
export const isActualValue = (value: any) => {
    if (!value) {
        return false;
    }

    return Object.keys(value).length > 0;
};

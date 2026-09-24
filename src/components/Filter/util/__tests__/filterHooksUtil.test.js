import {
    getApiQueryUrl,
    getApiPostBody,
    parseInitialFilterValues,
    getCurrentBrowserQueryParams,
    getFilterBrowserQueryParams
} from '../filterHooksUtil';
import { FILTERS, KEYWORD_DEMO, PHRASE_DEMO } from 'src/components/Filter/__tests__/filter.data';

const FILTER_HOOKS_UTIL_VALUES = { keywords: KEYWORD_DEMO, phrases: PHRASE_DEMO };
const FILTER_HOOKS_UTIL_LOCATION = { search: `&keywords=${KEYWORD_DEMO}&phrases=${encodeURIComponent(PHRASE_DEMO)}` };

describe('getApiQueryUrl', () => {
    it('returns the expected url', () => {
        expect(getApiQueryUrl(FILTERS, FILTER_HOOKS_UTIL_VALUES)).toBe(
            `&keywords=${KEYWORD_DEMO}&phrases=${encodeURIComponent(PHRASE_DEMO)}`
        );
    });
});

describe('getApiPostBody', () => {
    it('returns the expected post body', () => {
        expect(getApiPostBody(FILTERS, FILTER_HOOKS_UTIL_VALUES)).toMatchObject({
            keywords: KEYWORD_DEMO,
            phrases: PHRASE_DEMO
        });
    });
});

describe('parseInitialFilterValues', () => {
    it('returns the correctly parsed initial filter values', () => {
        expect(parseInitialFilterValues(FILTER_HOOKS_UTIL_LOCATION, FILTERS)).toMatchObject({
            keywords: KEYWORD_DEMO,
            phrases: PHRASE_DEMO
        });
    });

    it('overrides parsed values with preset values', () => {
        expect(parseInitialFilterValues(FILTER_HOOKS_UTIL_LOCATION, FILTERS, { phrases: 'overridden phrase' })).toMatchObject({
            keywords: KEYWORD_DEMO,
            phrases: 'overridden phrase'
        });
    });
});

describe('getCurrentBrowserQueryParams', () => {
    it('returns the correct current params', () => {
        expect(getCurrentBrowserQueryParams(FILTER_HOOKS_UTIL_LOCATION)).toMatchObject({
            keywords: KEYWORD_DEMO,
            phrases: PHRASE_DEMO
        });
    });

    it('returns the correct current params with excluded keys', () => {
        expect(getCurrentBrowserQueryParams(FILTER_HOOKS_UTIL_LOCATION, ['keywords'])).not.toMatchObject({
            keywords: KEYWORD_DEMO,
            phrases: PHRASE_DEMO
        });
        expect(getCurrentBrowserQueryParams(FILTER_HOOKS_UTIL_LOCATION, ['keywords'])).toMatchObject({
            phrases: PHRASE_DEMO
        });
    });
});

describe('getFilterBrowserQueryParams', () => {
    it('returns url values that have changed.', () => {
        expect(getFilterBrowserQueryParams(FILTERS, FILTER_HOOKS_UTIL_VALUES)).toMatchObject({
            keywords: KEYWORD_DEMO,
            phrases: PHRASE_DEMO
        });

        expect(getFilterBrowserQueryParams(FILTERS, { ...FILTER_HOOKS_UTIL_VALUES, keywords: '' })).not.toMatchObject({
            keywords: KEYWORD_DEMO,
            phrases: PHRASE_DEMO
        });

        expect(getFilterBrowserQueryParams(FILTERS, { ...FILTER_HOOKS_UTIL_VALUES, keywords: '' })).toMatchObject({
            phrases: PHRASE_DEMO
        });
    });

    it('does not return url values with the dateRange key.', () => {
        const FILTERS_WITH_DATERANGE_KEY = {
            ...FILTERS,
            dataRange: {
                ...FILTERS.keywords,
                label: 'Date Range'
            }
        };

        expect(
            getFilterBrowserQueryParams(FILTERS_WITH_DATERANGE_KEY, {
                ...FILTER_HOOKS_UTIL_VALUES,
                dateRange: 'asfdsd'
            })
        ).not.toMatchObject({
            keywords: KEYWORD_DEMO,
            phrases: PHRASE_DEMO,
            dataRange: 'asfdsd'
        });
        
        expect(
            getFilterBrowserQueryParams(FILTERS_WITH_DATERANGE_KEY, {
                ...FILTER_HOOKS_UTIL_VALUES,
                dateRange: 'asfdsd'
            })
        ).toMatchObject({
            keywords: KEYWORD_DEMO,
            phrases: PHRASE_DEMO
        });
    });

    describe('when a filter declares splitQueryParams', () => {
        const SPLIT_FILTERS = {
            ...FILTERS,
            customDateRange: {
                ...FILTERS.keywords,
                label: 'Custom Date Range',
                splitQueryParams: ['startDate', 'endDate'],
                isDefaultFilterValue: (value) => !value,
                getBrowserQueryUrlValue: (value) => value || {}
            }
        };

        it('spreads the returned object into its declared params under their own keys', () => {
            expect(
                getFilterBrowserQueryParams(SPLIT_FILTERS, {
                    ...FILTER_HOOKS_UTIL_VALUES,
                    customDateRange: { startDate: '2024-01-01', endDate: '2024-01-31' }
                })
            ).toMatchObject({
                startDate: '2024-01-01',
                endDate: '2024-01-31'
            });
        });

        it('ignores keys the filter has not declared in splitQueryParams', () => {
            const result = getFilterBrowserQueryParams(SPLIT_FILTERS, {
                ...FILTER_HOOKS_UTIL_VALUES,
                customDateRange: { startDate: '2024-01-01', unrelatedKey: 'nope' }
            });

            expect(result).not.toHaveProperty('unrelatedKey');
        });

        it('omits empty split param values so cleared params disappear', () => {
            const result = getFilterBrowserQueryParams(SPLIT_FILTERS, {
                ...FILTER_HOOKS_UTIL_VALUES,
                customDateRange: { startDate: '2024-01-01', endDate: '' }
            });

            expect(result).toMatchObject({ startDate: '2024-01-01' });
            expect(result).not.toHaveProperty('endDate');
        });

        it('contributes nothing for a default-valued split filter', () => {
            const result = getFilterBrowserQueryParams(SPLIT_FILTERS, {
                ...FILTER_HOOKS_UTIL_VALUES,
                customDateRange: null
            });

            expect(result).not.toHaveProperty('startDate');
            expect(result).not.toHaveProperty('endDate');
        });
    });
});

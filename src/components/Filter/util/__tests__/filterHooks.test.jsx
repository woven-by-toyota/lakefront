import { act, renderHook } from '@testing-library/react';
import { useFilter } from '../filterHooks';
import queryString from 'query-string';
import { DEFAULT_PHRASE_DEMO, FILTERS, KEYWORD_DEMO, LOCATION, PHRASE_DEMO } from 'src/components/Filter/__tests__/filter.data';

describe('useFilter', () => {
    it('should have initial values', () => {
        const { result } = renderHook(() => useFilter(FILTERS, false, LOCATION, () => null));

        const { filterValues } = result.current;
        expect(filterValues.keywords).toBe('');
        expect(filterValues.phrases).toBe('');
    });

    it ('should set initial preset values', () => {
       const { result } = renderHook(() => useFilter(FILTERS, false, LOCATION, () => null));

        act(() => {
            result.current.initializePresetValues({
                keywords: KEYWORD_DEMO,
                phrases: 'overridden phrase'
            });
        });
        const { filterValues } = result.current;
        expect(filterValues).toMatchObject({
            keywords: KEYWORD_DEMO,
            phrases: 'overridden phrase'
        });
    });

    it('update filter works', () => {
        const { result } = renderHook(() => useFilter(FILTERS, false, LOCATION, () => null));

        act(() => {
            result.current.updateFilter('keywords', KEYWORD_DEMO);
        });

        const { filterValues } = result.current;
        expect(filterValues.keywords).toBe(KEYWORD_DEMO);
    });

    it('update filter causes filter url values to change', () => {
        const { result } = renderHook(() => useFilter(FILTERS, false, LOCATION, () => null));

        act(() => {
            result.current.updateFilter('keywords', KEYWORD_DEMO);
        });
        act(() => {
            result.current.updateFilter('phrases', PHRASE_DEMO);
        });

        const { filterUrl } = result.current;
        expect(filterUrl).toContain(`&keywords=${KEYWORD_DEMO}`);
        expect(filterUrl).toContain(`&phrases=${encodeURIComponent(PHRASE_DEMO)}`);
    });

    it('update filter causes filter post body values to change', () => {
        const { result } = renderHook(() => useFilter(FILTERS, false, LOCATION, () => null));

        act(() => {
            result.current.updateFilter('keywords', KEYWORD_DEMO);
        });
        act(() => {
            result.current.updateFilter('phrases', PHRASE_DEMO);
        });

        let { filterPostBody } = result.current;
        expect(filterPostBody.keywords).toBe(KEYWORD_DEMO);
        expect(filterPostBody.phrases).toBe(PHRASE_DEMO);

        act(() => {
            result.current.updateFilter('keywords', '');
        });
        act(() => {
            result.current.updateFilter('phrases', '');
        });

        ({ filterPostBody } = result.current);
        expect(filterPostBody).toEqual({});
    });

    it('reset all filters works', () => {
        const { result } = renderHook(() => useFilter(FILTERS, false, LOCATION, () => null));

        act(() => {
            result.current.updateFilter('keywords', KEYWORD_DEMO);
        });
        act(() => {
            result.current.updateFilter('phrases', PHRASE_DEMO);
        });

        act(() => {
            const filterUrl = result.current.filterUrl;
            expect(filterUrl).toMatch(/phrases/);
            expect(filterUrl).toMatch(/keywords/);
        });

        act(() => {
            result.current.resetAllFilters();
        });

        act(() => {
            const filterUrl = result.current.filterUrl;
            expect(filterUrl).toBe('');
        });
    });

    it('reset all filter sets default value.', () => {
        const FILTERS_WITH_DEFAULT_PHRASES = {
            ...FILTERS,
            phrases: {
                ...FILTERS.phrases,
                getDefaultFilterValue: () => {
                    return DEFAULT_PHRASE_DEMO;
                }
            }
        };
        const { result } = renderHook(() => useFilter(FILTERS_WITH_DEFAULT_PHRASES, false, LOCATION, () => null));

        act(() => {
            result.current.updateFilter('keywords', KEYWORD_DEMO);
        });
        act(() => {
            result.current.updateFilter('phrases', PHRASE_DEMO);
        });

        act(() => {
            const filterUrl = result.current.filterUrl;
            expect(filterUrl).toMatch(/phrases/);
            expect(filterUrl).toMatch(/keywords/);
        });

        act(() => {
            result.current.resetAllFilters();
        });

        act(() => {
            const filterUrl = result.current.filterUrl;
            expect(filterUrl).toBe(`&phrases=${encodeURIComponent(DEFAULT_PHRASE_DEMO)}`);
        });
    });

    describe('when a filter has the required property set to true', () => {
        const FILTERS_WITH_REQUIRED_PHRASES = {
            ...FILTERS,
            phrases: {
                ...FILTERS.phrases,
                required: true
            }
        };

        it('should not change filter value when calling resetFilter', () => {
            const { result } = renderHook(() => useFilter(FILTERS_WITH_REQUIRED_PHRASES, false, LOCATION, () => null));

            act(() => {
                result.current.updateFilter('phrases', PHRASE_DEMO);
            });
            expect(result.current.filterValues.phrases).toBe(PHRASE_DEMO);

            act(() => {
                result.current.resetFilter('phrases');
            });
            expect(result.current.filterValues.phrases).toBe(PHRASE_DEMO);
        });

        it('should keep existing filter value for required filter only when calling resetAllFilters', () => {
            const { result } = renderHook(() => useFilter(FILTERS_WITH_REQUIRED_PHRASES, false, LOCATION, () => null));

            act(() => {
                result.current.updateFilter('keywords', KEYWORD_DEMO);
            });
            act(() => {
                result.current.updateFilter('phrases', PHRASE_DEMO);
            });

            expect(result.current.filterValues.keywords).toBe(KEYWORD_DEMO);
            expect(result.current.filterValues.phrases).toBe(PHRASE_DEMO);

            act(() => {
                result.current.resetAllFilters();
            });

            // keywords is cleared/reset, but phrases is not changed
            expect(result.current.filterValues.keywords).toBe('');
            expect(result.current.filterValues.phrases).toBe(PHRASE_DEMO);
        });
    });

    it('calls updateHistory on filter update', () => {
        const updateHistory = jest.fn();
        const { result } = renderHook(() => useFilter(FILTERS, false, LOCATION, updateHistory));

        act(() => {
            result.current.updateFilter('keywords', KEYWORD_DEMO);
        });
        act(() => {
            result.current.updateFilter('phrases', PHRASE_DEMO);
        });

        expect(updateHistory).toHaveBeenCalledWith({
            search: queryString.stringify({
                keywords: KEYWORD_DEMO,
                phrases: PHRASE_DEMO
            })
        });
    });

    it('keeps a split filter\'s query params in the url when an unrelated filter changes', () => {
        const updateHistory = jest.fn();
        const FILTERS_WITH_SPLIT = {
            ...FILTERS,
            dateRange: {
                ...FILTERS.keywords,
                label: 'Date Range',
                splitQueryParams: ['startDate', 'endDate'],
                isDefaultFilterValue: (value) => !value,
                getBrowserQueryUrlValue: (value) => value || {}
            }
        };
        const { result } = renderHook(() => useFilter(FILTERS_WITH_SPLIT, false, LOCATION, updateHistory));

        act(() => {
            result.current.updateFilter('dateRange', { startDate: '2024-01-01', endDate: '2024-01-31' });
        });

        act(() => {
            result.current.updateFilter('keywords', KEYWORD_DEMO);
        });

        const { search } = updateHistory.mock.calls[updateHistory.mock.calls.length - 1][0];
        expect(search).toContain('startDate=2024-01-01');
        expect(search).toContain('endDate=2024-01-31');
        expect(search).toContain(`keywords=${KEYWORD_DEMO}`);
    });

    describe('when a filter has the required property set to false', () => {
        it('resets filter name when calling resetFilter with no passed value', () => {
            const FILTERS_WITH_NOT_REQUIRED_PHRASES = {
                ...FILTERS,
                phrases: {
                    ...FILTERS.phrases,
                    required: false
                }
            };
            const { result } = renderHook(() => useFilter(FILTERS_WITH_NOT_REQUIRED_PHRASES, false, LOCATION, () => null));

            act(() => {
                result.current.updateFilter('phrases', PHRASE_DEMO);
            });
            expect(result.current.filterValues.phrases).toBe(PHRASE_DEMO);

            act(() => {
                result.current.resetFilter('phrases');
            });
            expect(result.current.filterValues.phrases).toBe('');
        });

        it('clears part of the filter value when value is passed and clearPartialSingleFilter is defined', () => {
            const FILTERS_WITH_NOT_REQUIRED_PHRASES = {
                ...FILTERS,
                phrases: {
                    ...FILTERS.phrases,
                    required: false
                }
            };

            const { result } = renderHook(() => useFilter(FILTERS_WITH_NOT_REQUIRED_PHRASES, false, LOCATION, () => null));

            act(() => {
                result.current.updateFilter('phrases', PHRASE_DEMO);
            });
            expect(result.current.filterValues.phrases).toBe(PHRASE_DEMO);

            act(() => {
                result.current.resetFilter('phrases', 'phrases');
            });
            expect(result.current.filterValues.phrases).toBe('phrases');
        });

        it('does not clear part of filter if value is provided and clearPartialSingleFilter is not defined', () => {
            const FILTERS_WITH_NOT_REQUIRED_PHRASES = {
                ...FILTERS,
                phrases: {
                    ...FILTERS.phrases,
                    required: false,
                    clearPartialSingleFilter: undefined
                }
            };
            const { result } = renderHook(() => useFilter(FILTERS_WITH_NOT_REQUIRED_PHRASES, false, LOCATION, () => null));

            act(() => {
                result.current.updateFilter('phrases', PHRASE_DEMO);
            });
            expect(result.current.filterValues.phrases).toBe(PHRASE_DEMO);

            act(() => {
                result.current.resetFilter('phrases', 'phrases');
            });
            expect(result.current.filterValues.phrases).toBe('');
        });
    });
});

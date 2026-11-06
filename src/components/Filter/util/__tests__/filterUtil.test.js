import { FILTERS } from 'src/components/Filter/__tests__/filter.data';
import {
    areSetsEqual,
    convertToFilterDropdownOptions,
    getDefaultJsonViewValue,
    getDefaultValue,
    getFilterAppliedCount,
    getUrlFromList
} from '../filterUtil';

describe('getDefaultValue', () => {
    describe('when url parameter key exists', () => {
        it('returns first array value when found value is an array', () => {
            expect(getDefaultValue({ found: [1, 2, 3] }, 'found')).toBe(1);
        });

        it('returns first array value when found value is not an array', () => {
            expect(getDefaultValue({ found: 'value' }, 'found')).toBe('value');
        });
    });

    describe('when url parameter key does not exist', () => {
        it('returns the provided default value', () => {
            expect(getDefaultValue({}, 'missing')).toBeUndefined();
            expect(getDefaultValue({}, 'missing', true)).toBe(true);
        });
    });
});

describe('getDefaultJsonViewValue', () => {
    it("returns true if jsonView key exists and is the string 'true'", () => {
        expect(getDefaultJsonViewValue({ jsonView: 'true' })).toBe(true);
    });

    it("returns false if jsonView key exists and is not the string 'true'", () => {
        expect(getDefaultJsonViewValue({ jsonView: true })).toBe(false);
        expect(getDefaultJsonViewValue({ jsonView: false })).toBe(false);
        expect(getDefaultJsonViewValue({ jsonView: undefined })).toBe(false);
    });

    it('returns false if jsonView key does not exists', () => {
        expect(getDefaultJsonViewValue({})).toBe(false);
    });
});

describe('getFilterAppliedCount', () => {
    it('returns the count of all changed filters', () => {
        expect(getFilterAppliedCount(FILTERS, { keywords: '', phrases: '2' })).toBe(1);
        expect(getFilterAppliedCount(FILTERS, { keywords: '2', phrases: '2' })).toBe(2);
    });

    it('does not count unchanged filters', () => {
        expect(getFilterAppliedCount(FILTERS, { keywords: '', phrases: '' })).toBe(0);
    });

    it('does not count required filters.', () => {
        const FILTERS_WITH_REQUIRED_PHRASES = {
            ...FILTERS,
            phrases: {
                ...FILTERS.phrases,
                required: true
            }
        };

        expect(
            getFilterAppliedCount(FILTERS_WITH_REQUIRED_PHRASES, {
                keywords: '',
                phrases: '2'
            })
        ).toBe(0);
    });
});

describe('getUrlFromList', () => {
    it('appends each list item to the url with correct name', () => {
        expect(getUrlFromList('item', ['red', 'blue'], 3)).toBe('&item=red&item=blue');
    });

    describe('when list is an array', () => {
        it('returns an empty string if list size matches count.', () => {
            expect(getUrlFromList('item', ['red', 'blue'], 2)).toBe('');
        });

        it('returns an empty string if list size is 0.', () => {
            expect(getUrlFromList('item', [], 2)).toBe('');
        });
    });

    describe('when list is a set', () => {
        it('returns an empty string if list size matches count.', () => {
            expect(getUrlFromList('item', new Set(['red', 'blue']), 2)).toBe('');
        });

        it('returns an empty string if list size is 0.', () => {
            expect(getUrlFromList('item', new Set(), 2)).toBe('');
        });
    });

    describe('when initialValue is passed', () => {
        it('returns the full url when initial value is true', () => {
            expect(getUrlFromList('item', new Set(['good', 'better', 'best']), 3, true)).toBe(
                '&item=good&item=better&item=best'
            );
        });

        it('returns "" when initial value is false with all options selected', () => {
            expect(getUrlFromList('item', new Set(['good', 'better', 'best']), 3, false)).toBe('');
        });
    });

    describe('areSetsEqual', () => {
        const initialValueSet = new Set(['better']);
        it('returns expected results when comparing equal Sets ', () => {
            const valueSet = new Set(['better']);
            expect(areSetsEqual(initialValueSet, valueSet)).toBe(true);
        });

        it('returns expected results when comparing non equal Sets ', () => {
            const valueSet = new Set(['best']);
            expect(areSetsEqual(initialValueSet, valueSet)).toBe(false);
        });
    });
});

describe('preset filter dropdown options', () => {
    it('returns empty array if provided empty filterMapping', () => {
        const emptyFilterMapping = {};

        expect(convertToFilterDropdownOptions(emptyFilterMapping)).toStrictEqual([]);
    });

    it('returns empty array if provided undefined filterMapping', () => {
        expect(convertToFilterDropdownOptions(undefined)).toStrictEqual([]);
    });

    it('converts filter mapping to filter dropdown options', () => {
        const filterMapping = {
            devMode: {
                phrases: ''
            },
            prodMode: {
                phrases: ''
            }
        };

        expect(convertToFilterDropdownOptions(filterMapping)).toStrictEqual([
            { label: 'Dev Mode', value: 'devMode' },
            { label: 'Prod Mode', value: 'prodMode' }
        ]);
    });
});

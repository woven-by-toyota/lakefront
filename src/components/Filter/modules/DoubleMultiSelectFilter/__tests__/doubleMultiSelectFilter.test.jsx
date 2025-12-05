import React from 'react';
import { within } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import DoubleMultiSelectFilter from '../DoubleMultiSelectFilter';

export const DOUBLE_MULTI_SELECT_FILTER_OPTIONS = {
    firstSelect: {
        apiField: 'first',
        label: 'First Filter',
        name: 'first',
        creatable: true,
        items: [],
        placeholder: 'Type or paste',
        disableMenu: true,
        barLabel: 'First Filter'
    },
    secondSelect: {
        apiField: 'second',
        label: 'Second Filter',
        name: 'second',
        creatable: true,
        items: [],
        placeholder: 'Type or paste',
        disableMenu: true,
        barLabel: 'Second Filter'
    }
};

const DEFAULT_PROPS = {
    label: 'Test',
    description: 'Test Filter',
    selectOptions: DOUBLE_MULTI_SELECT_FILTER_OPTIONS
};

describe('DoubleMultiSelectFilter', () => {
    it('returns the proper label', () => {
        const label = 'label';
        expect(DoubleMultiSelectFilter({ label }, {})).toMatchObject({ label });
    });

    it('returns the proper description', () => {
        const description = 'description';
        expect(DoubleMultiSelectFilter({ description }, {})).toMatchObject({ description });
    });

    describe('getApiQueryUrl', () => {
        const { getApiQueryUrl } = DoubleMultiSelectFilter(DEFAULT_PROPS, {});

        it('returns the proper url', () => {
            const firstValue = { firstSelect: ['first name'] };
            const secondValue = { firstSelect: ['first name'], secondSelect: ['second name'] };
            expect(getApiQueryUrl(DEFAULT_PROPS.selectOptions.firstSelect.apiField, firstValue))
                .toBe('&first=first name');
            expect(getApiQueryUrl(DEFAULT_PROPS.selectOptions.secondSelect.apiField, secondValue))
                .toBe('&first=first name&second=second name');
        });

        it('returns an empty string when value has no length', () => {
            expect(getApiQueryUrl('a', [])).toBe('');
        });

        it('returns an empty string when value length matches options length', () => {
            expect(getApiQueryUrl('a', ['1','2','3'])).toBe('');
        });
    });

    describe('getApiPostBody', () => {
        const { getApiPostBody } = DoubleMultiSelectFilter(DEFAULT_PROPS, {});

        it('returns the proper object when there is a value', () => {
            const firstValue = { firstSelect: ['first name'] };
            const secondValue = { firstSelect: ['first name'], secondSelect: ['second name'] };
            expect(getApiPostBody(DEFAULT_PROPS.selectOptions.firstSelect.apiField, firstValue))
                .toMatchObject({ first: ['first name'] });
            expect(getApiPostBody(DEFAULT_PROPS.selectOptions.firstSelect.apiField, secondValue))
                .toMatchObject({ first: ['first name'], second: ['second name'] });
        });

        it('returns undefined when value is falsy', () => {
            expect(getApiPostBody('a')).toBeUndefined();
        });

        it('returns undefined when value has no length', () => {
            const firstValue = { firstSelect: [] };
            expect(getApiPostBody('a', firstValue)).toBeUndefined();
        });
    });

    describe('getBrowserQueryUrlValue', () => {
        const { getBrowserQueryUrlValue } = DoubleMultiSelectFilter({}, {});

        it('returns the stringified value when truthy value is provided', () => {
            const firstValue = { firstSelect: [1], secondSelect: [2] };
            expect(getBrowserQueryUrlValue([])).toBe('');
            expect(getBrowserQueryUrlValue(firstValue)).toBe('1~2');
        });

        it('returns empty string when falsy value is provided', () => {
            expect(getBrowserQueryUrlValue()).toBe('');
            expect(getBrowserQueryUrlValue(false)).toBe('');
        });
    });

    describe('getDefaultFilterValue', () => {
        const { getDefaultFilterValue } = DoubleMultiSelectFilter({}, {});

        it('returns null always', () => {
            expect(getDefaultFilterValue('a')).toBe(null);
            expect(getDefaultFilterValue(1)).toBe(null);
            expect(getDefaultFilterValue()).toBe(null);
        });
    });

    describe('isDefaultFilterValue', () => {
        const { isDefaultFilterValue } = DoubleMultiSelectFilter(DEFAULT_PROPS, {});

        it('returns true if value is null', () => {
            expect(isDefaultFilterValue(null)).toBe(true);
        });

        it('returns false if value is not null', () => {
            expect(isDefaultFilterValue(['a', 'b', 'c'])).toBe(false);
        });
    });

    describe('getFilterBarLabel', () => {
        describe('when values is falsy', () => {
            it('returns empty string', () => {
                const { getFilterBarLabel } = DoubleMultiSelectFilter(DEFAULT_PROPS, {});
                expect(getFilterBarLabel()).toBe('');
            });
        });

        describe('when values is truthy', () => {
            it('returns empty string if values is not an array', () => {
                const { getFilterBarLabel } = DoubleMultiSelectFilter(DEFAULT_PROPS, {});
                expect(getFilterBarLabel('a')).toBe('');
                expect(getFilterBarLabel({})).toBe('');
            });

            it('returns label of values array when provided values do not exist in provided options', () => {
                const { getFilterBarLabel } = DoubleMultiSelectFilter(DEFAULT_PROPS, {});
                const value = { firstSelect: [1], secondSelect: [2] };
                expect(getFilterBarLabel(value)).toBe('First Filter: 1 Second Filter: 2');
            });
        });
    });

    describe('getFilterSectionLabel', () => {
        describe('when values is falsy', () => {
            it('returns empty array', () => {
                const { getFilterSectionLabel } = DoubleMultiSelectFilter(DEFAULT_PROPS, {});
                expect(getFilterSectionLabel()).toBe('');
            });
        });

        describe('when values is truthy', () => {
            it('returns empty array if values is not an object with proper fields', () => {
                const { getFilterSectionLabel } = DoubleMultiSelectFilter(DEFAULT_PROPS, {});
                expect(getFilterSectionLabel('a')).toBe('');
                expect(getFilterSectionLabel({})).toBe('');
            });

            it('returns values array when provided values', () => {
                const { getFilterSectionLabel } = DoubleMultiSelectFilter(DEFAULT_PROPS, {});
                const value = { firstSelect: [1], secondSelect: [2] };
                expect(getFilterSectionLabel(value)).toMatchObject(['First Filter: 1', 'Second Filter: 2']);
            });
        });
    });

    describe('parseInitialFilterValue', () => {
        describe('when value is truthy', () => {
            const { parseInitialFilterValue } = DoubleMultiSelectFilter({ initialValue: '' }, {});

            it('returns array with value if value is a string', () => {
                const expected = { firstSelect: ['a'] };
                expect(parseInitialFilterValue('a')).toMatchObject(expected);
            });
        });

        describe('when value is falsy', () => {
            const { parseInitialFilterValue } = DoubleMultiSelectFilter({ initialValue: '' }, {});

            it('returns null if value is nullish or is an empty string', () => {
                expect(parseInitialFilterValue()).toBe(null);
                expect(parseInitialFilterValue(null)).toBe(null);
                expect(parseInitialFilterValue('')).toBe(null);
            });
        });
    });

    describe('renderComponent', () => {
        const { renderComponent } = DoubleMultiSelectFilter(DEFAULT_PROPS, {});

        it('returns the expected component', () => {
            const update = () => null;
            const value = { firstSelect: ['a'] };

            const { container, getByText } = render(<div>{renderComponent({ name: 'name', value, update })}</div>);
            expect(container.querySelector('input[name="first"]')).toBeInTheDocument();
            expect(container.querySelector('input[name="second"]')).toBeInTheDocument();
            getByText('a');
        });
    });

    describe('renderSectionHeader', () => {
        const doubleMultiSelectFilter = DoubleMultiSelectFilter({ ...DEFAULT_PROPS, label: 'Section Header' }, {});
        const { renderSectionHeader } = doubleMultiSelectFilter;

        it('returns the expected component', () => {
            const sectionHeaderProps = {
                filter: doubleMultiSelectFilter,
                name: 'dbl',
                value: { firstSelect: ['a'], secondSelect: ['b', 'c'] },
                resetFilter: () => null,
                badgeThreshold: 1
            };

            const { getByText } = render(<div>{renderSectionHeader(sectionHeaderProps)}</div>);

            getByText('Section Header');
            const firstFilter = getByText('First Filter');
            const secondFilter = getByText('Second Filter');
            within(firstFilter.nextElementSibling).getByText('1');
            within(secondFilter.nextElementSibling).getByText('2');
        });

        it('overrides filter count to hide extra badge count', () => {
            const sectionHeaderProps = {
                filter: doubleMultiSelectFilter,
                name: 'dbl',
                value: { firstSelect: ['a'], secondSelect: ['b', 'c'] },
                resetFilter: () => null,
                badgeThreshold: 1
            };

            const { container } = render(<div>{renderSectionHeader(sectionHeaderProps)}</div>);
            const badge = container.querySelector('div[aria-details="count of applied filters"]');

            expect(badge).not.toBeInTheDocument();
        });
    });

    describe('DoubleMultiSelectFilterOptions', () => {
        const filterModuleKeys = [
            'label',
            'description',
            'getFilterCount',
            'getApiQueryUrl',
            'getApiPostBody',
            'getBrowserQueryUrlValue',
            'getDefaultFilterValue',
            'isDefaultFilterValue',
            'getFilterBarLabel',
            'getFilterSectionLabel',
            'parseInitialFilterValue',
            'renderComponent'
        ];

        const {
            label,
            description,
            getFilterCount,
            getApiQueryUrl,
            getApiPostBody,
            getBrowserQueryUrlValue,
            getDefaultFilterValue,
            isDefaultFilterValue,
            getFilterBarLabel,
            getFilterSectionLabel,
            parseInitialFilterValue,
            renderComponent
        } = DoubleMultiSelectFilter(
            {
                label: 'label',
                description: 'description'
            },
            filterModuleKeys.reduce((acc, k) => ({ ...acc, [k]: () => null }), {})
        );

        it('does not override label and description', () => {
            expect(label).toBe('label');
            expect(description).toBe('description');
        });

        it('overrides default methods', () => {
            expect(getFilterCount('a')).toBeNull();
            expect(getApiQueryUrl('a', 'b')).toBeNull();
            expect(getApiPostBody('a', 'b')).toBeNull();
            expect(getBrowserQueryUrlValue('a')).toBeNull();
            expect(getDefaultFilterValue('a')).toBeNull();
            expect(isDefaultFilterValue('a')).toBeNull();
            expect(getFilterBarLabel('a')).toBeNull();
            expect(getFilterSectionLabel('a')).toBeNull();
            expect(parseInitialFilterValue('a')).toBeNull();

            const update = () => null;
            const { queryByRole, queryByText } = render(<div>{renderComponent({ name: 'name', value: ['colors'], update })}</div>);

            expect(queryByRole('textbox')).not.toBeInTheDocument();
            expect(queryByText('colors')).not.toBeInTheDocument();
        });
    });
});

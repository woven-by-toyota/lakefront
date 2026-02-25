import React from 'react';
import { renderWithTheme as render } from 'src/lib/testing';
import MultiSelectFilter from '../MultiSelectFilter';

export const MULTI_SELECT_FILTER_OPTIONS = [
    {
        label: 'colors',
        value: 'colors'
    },
    {
        label: 'sizes',
        value: 'sizes'
    },
    {
        label: 'shapes',
        value: 'shapes'
    }
];

describe('MultiSelectFilter', () => {
    it('returns the proper label', () => {
        const label = 'label';
        expect(MultiSelectFilter({ label }, {})).toMatchObject({ label });
    });

    it('returns the proper description', () => {
        const description = 'description';
        expect(MultiSelectFilter({ description }, {})).toMatchObject({ description });
    });

    describe('getFilterCount', () => {
        const { getFilterCount } = MultiSelectFilter({}, {});

        it('returns length of provided array', () => {
            expect(getFilterCount([1])).toBe(1);
            expect(getFilterCount([1, 2])).toBe(2);
        });

        it('returns 0 when a falsy value is provided', () => {
            expect(getFilterCount(null)).toBe(0);
            expect(getFilterCount()).toBe(0);
        });
    });

    describe('getApiQueryUrl', () => {
        const { getApiQueryUrl } = MultiSelectFilter({ options: MULTI_SELECT_FILTER_OPTIONS }, {});

        it('returns the proper url', () => {
            expect(getApiQueryUrl('a', ['first name'])).toBe('&a=first+name');
            expect(getApiQueryUrl('a', ['first', 'last'])).toBe('&a=first&a=last');
        });

        it('returns an empty string when value has no length', () => {
            expect(getApiQueryUrl('a', [])).toBe('');
        });

        it('returns an empty string when value length matches options length', () => {
            expect(getApiQueryUrl('a', ['1','2','3'])).toBe('');
        });
    });

    describe('getApiPostBody', () => {
        const { getApiPostBody } = MultiSelectFilter({}, {});

        it('returns the proper object when there is a value', () => {
            expect(getApiPostBody('a', ['first', 'last'])).toMatchObject({ a: ['first', 'last'] });
        });

        it('returns undefined when value is falsy', () => {
            expect(getApiPostBody('a')).toBeUndefined();
        });

        it('returns undefined when value has no length', () => {
            expect(getApiPostBody('a', [])).toBeUndefined();
        });
    });

    describe('getBrowserQueryUrlValue', () => {
        const { getBrowserQueryUrlValue } = MultiSelectFilter({}, {});

        it('returns the provided value when truthy value is provided', () => {
            expect(getBrowserQueryUrlValue([])).toMatchObject([]);
            expect(getBrowserQueryUrlValue(1)).toBe(1);
            expect(getBrowserQueryUrlValue()).toBeUndefined();
        });
    });

    describe('getDefaultFilterValue', () => {
        const { getDefaultFilterValue } = MultiSelectFilter({}, {});

        it('returns an empty array', () => {
            expect(getDefaultFilterValue('a')).toMatchObject([]);
            expect(getDefaultFilterValue(1)).toMatchObject([]);
            expect(getDefaultFilterValue()).toMatchObject([]);
        });
    });

    describe('isDefaultFilterValue', () => {
        const { isDefaultFilterValue } = MultiSelectFilter({ options: MULTI_SELECT_FILTER_OPTIONS }, {});

        it('returns true if value has no length', () => {
            expect(isDefaultFilterValue([])).toBe(true);
        });

        it('returns true if value length matches option length', () => {
            expect(isDefaultFilterValue(['a', 'b', 'c'])).toBe(true);
        });

        it('returns false if value has non-zero length unequal to options length', () => {
            expect(isDefaultFilterValue(['a'])).toBe(false);
        });
    });

    describe('getFilterBarLabel', () => {
        describe('when values is falsy', () => {
            it('returns empty string', () => {
                const { getFilterBarLabel } = MultiSelectFilter({ options: MULTI_SELECT_FILTER_OPTIONS }, {});
                expect(getFilterBarLabel()).toBe('');
            });
        });

        describe('when values is truthy', () => {
            it('returns empty string if values is not an array', () => {
                const { getFilterBarLabel } = MultiSelectFilter({ options: MULTI_SELECT_FILTER_OPTIONS }, {});
                expect(getFilterBarLabel('a')).toBe('');
                expect(getFilterBarLabel({})).toBe('');
            });

            it('returns label of values array when provided values do not exist in provided options', () => {
                const { getFilterBarLabel } = MultiSelectFilter({ options: MULTI_SELECT_FILTER_OPTIONS, label: 'label' }, {});
                expect(getFilterBarLabel(['a', 'b', 'c'])).toBe('label: a,b,c');
            });

            it('returns label of labels array when provided values exist in provided options', () => {
                const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }];
                const { getFilterBarLabel } = MultiSelectFilter({ options: options, label: 'label' }, {});
                expect(getFilterBarLabel(['a', 'b', 'c'])).toBe('label: A,B,C');
            });

            it('returns mixed label of labels and values array when some values exist in provided options', () => {
                const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }];
                const { getFilterBarLabel } = MultiSelectFilter({ options: options, label: 'label' }, {});
                expect(getFilterBarLabel(['a', 'b', 'd', 'e'])).toBe('label: A,B,d,e');
            });

            it('properly formats labels with "["', () => {
                const options = [{ value: 'a', label: 'A [b]' }, { value: 'b', label: 'B [a]' }];
                const { getFilterBarLabel } = MultiSelectFilter({ options: options, label: 'label' }, {});
                expect(getFilterBarLabel(['a', 'b'])).toBe('label: A,B');
            });
        });
    });

    describe('getFilterSectionLabel', () => {
        describe('when values is falsy', () => {
            it('returns empty array', () => {
                const { getFilterSectionLabel } = MultiSelectFilter({ options: MULTI_SELECT_FILTER_OPTIONS }, {});
                expect(getFilterSectionLabel()).toMatchObject([]);
            });
        });

        describe('when values is truthy', () => {
            it('returns empty array if values is not an array', () => {
                const { getFilterSectionLabel } = MultiSelectFilter({ options: MULTI_SELECT_FILTER_OPTIONS }, {});
                expect(getFilterSectionLabel('a')).toMatchObject([]);
                expect(getFilterSectionLabel({})).toMatchObject([]);
            });

            it('returns values array when provided values do not exist in provided options', () => {
                const { getFilterSectionLabel } = MultiSelectFilter({ options: MULTI_SELECT_FILTER_OPTIONS, label: 'label' }, {});
                expect(getFilterSectionLabel(['a', 'b', 'c'])).toMatchObject(['a', 'b', 'c']);
            });

            it('returns labels array when provided values exist in provided options', () => {
                const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }];
                const { getFilterSectionLabel } = MultiSelectFilter({ options: options, label: 'label' }, {});
                expect(getFilterSectionLabel(['a', 'b', 'c'])).toMatchObject(['A', 'B', 'C']);
            });

            it('returns mixed label of labels and values array when some values exist in provided options', () => {
                const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }];
                const { getFilterSectionLabel } = MultiSelectFilter({ options: options, label: 'label' }, {});
                expect(getFilterSectionLabel(['a', 'b', 'd', 'e'])).toMatchObject(['A', 'B', 'd', 'e']);
            });

            it('properly formats labels with "["', () => {
                const options = [{ value: 'a', label: 'A [b]' }, { value: 'b', label: 'B [a]' }];
                const { getFilterSectionLabel } = MultiSelectFilter({ options: options, label: 'label' }, {});
                expect(getFilterSectionLabel(['a', 'b'])).toMatchObject(['A', 'B']);
            });
        });
    });

    describe('parseInitialFilterValue', () => {
        describe('when value is truthy', () => {
            const { parseInitialFilterValue } = MultiSelectFilter({ initialValue: '' }, {});
            it('returns array with value if value is a string', () => {
                expect(parseInitialFilterValue('a')).toMatchObject(['a']);
            });

            it('returns value if value is not a string', () => {
                expect(parseInitialFilterValue(['a', 'b'])).toMatchObject(['a', 'b']);
                expect(parseInitialFilterValue(true)).toBe(true);
            });
        });

        describe('when value is falsy', () => {
            it('returns array with initialvalue if initialvalue is a string', () => {
                const { parseInitialFilterValue } = MultiSelectFilter({ initialValue: 'a' }, {});
                expect(parseInitialFilterValue()).toMatchObject(['a']);
            });

            it('returns value if value is not a string', () => {
                const { parseInitialFilterValue } = MultiSelectFilter({ initialValue: ['a', 'b'] }, {});
                expect(parseInitialFilterValue()).toMatchObject(['a', 'b']);
            });
        });
    });

    describe('renderComponent', () => {
        const { renderComponent } = MultiSelectFilter({ options: MULTI_SELECT_FILTER_OPTIONS }, {});

        it('returns the expected component', () => {
            const update = () => null;
            const { getByRole, getByText } = render(<div>{renderComponent({ name: 'name', value: ['colors'], update })}</div>);
            getByRole('combobox');
            getByText('colors');
        });
    });

    describe('multiSelectFilterOptions', () => {
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
        } = MultiSelectFilter(
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

            expect(queryByRole('combobox')).not.toBeInTheDocument();
            expect(queryByText('colors')).not.toBeInTheDocument();
        });
    });

    describe('clearPartialSingleFilter', () => {
        const options = [{ value: 'a', label: 'A [b]' }, { value: 'b', label: 'B [a]' }];
        const { clearPartialSingleFilter } = MultiSelectFilter({ options });

        it('clears part of the filter if value exists', () => {
            const result = clearPartialSingleFilter(['a', 'b'], 'a');
            expect(result).toStrictEqual(['b']);
        });

        it('returns original array when value is not provided', () => {
            const result = clearPartialSingleFilter(['a', 'b'], '');
            expect(result).toStrictEqual(['a', 'b']);
        });
    });

    describe('theme support', () => {
        const { renderComponent } = MultiSelectFilter({ options: MULTI_SELECT_FILTER_OPTIONS }, {});

        it('renders component consistently in light theme', () => {
            const update = () => null;
            const { getByRole, getByText } = render(
                <div>{renderComponent({ name: 'name', value: ['colors'], update })}</div>
            );
            getByRole('combobox');
            getByText('colors');
        });

        it('renders component consistently in dark theme', () => {
            const update = () => null;
            const { getByRole, getByText } = render(
                <div>{renderComponent({ name: 'name', value: ['colors'], update })}</div>,
                'dark'
            );
            getByRole('combobox');
            getByText('colors');
        });

        it('handles multiple selected values across themes', () => {
            const update = () => null;

            const { getByRole: lightGetByRole, getByText: lightGetByText } = render(
                <div>{renderComponent({ name: 'name', value: ['colors', 'sizes'], update })}</div>
            );

            const { getByRole: darkGetByRole, getByText: darkGetByText } = render(
                <div>{renderComponent({ name: 'name', value: ['colors', 'sizes'], update })}</div>,
                'dark'
            );

            // Both should have combobox
            lightGetByRole('combobox');
            darkGetByRole('combobox');

            // Both should show selected values
            lightGetByText('colors');
            lightGetByText('sizes');
            darkGetByText('colors');
            darkGetByText('sizes');
        });

        it('renders empty state consistently across themes', () => {
            const update = () => null;

            const { getByRole: lightGetByRole } = render(
                <div>{renderComponent({ name: 'name', value: [], update })}</div>
            );

            const { getByRole: darkGetByRole } = render(
                <div>{renderComponent({ name: 'name', value: [], update })}</div>,
                'dark'
            );

            // Both should have combobox even when empty
            lightGetByRole('combobox');
            darkGetByRole('combobox');
        });

        it('maintains functionality with custom options across themes', () => {
            const customOptions = [
                { label: 'Custom A', value: 'custom_a' },
                { label: 'Custom B', value: 'custom_b' }
            ];

            const customFilter = MultiSelectFilter({ options: customOptions }, {});
            const { renderComponent: customRenderComponent } = customFilter;
            const update = () => null;

            const { getByText: lightGetByText } = render(
                <div>{customRenderComponent({ name: 'custom', value: ['custom_a'], update })}</div>
            );

            const { getByText: darkGetByText } = render(
                <div>{customRenderComponent({ name: 'custom', value: ['custom_a'], update })}</div>,
                'dark'
            );

            lightGetByText('Custom A');
            darkGetByText('Custom A');
        });

        describe('overridden methods with theme support', () => {
            const filterModuleKeys = [
                'renderComponent'
            ];

            const customOverrides = {
                renderComponent: ({ name, value, update }) => <div>Custom render: {value.join(', ')}</div>
            };

            const overriddenFilter = MultiSelectFilter(
                { options: MULTI_SELECT_FILTER_OPTIONS },
                customOverrides
            );

            it('respects method overrides in both themes', () => {
                const { renderComponent: overriddenRenderComponent } = overriddenFilter;
                const update = () => null;

                const { getByText: lightGetByText } = render(
                    <div>{overriddenRenderComponent({ name: 'test', value: ['colors', 'sizes'], update })}</div>
                );

                const { getByText: darkGetByText } = render(
                    <div>{overriddenRenderComponent({ name: 'test', value: ['colors', 'sizes'], update })}</div>,
                    'dark'
                );

                lightGetByText('Custom render: colors, sizes');
                darkGetByText('Custom render: colors, sizes');
            });
        });
    });
});

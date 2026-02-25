import React from 'react';
import { renderWithTheme as render } from 'src/lib/testing';
import SingleSelectFilter from '../SingleSelectFilter';

const SINGLE_SELECT_FILTER_OPTIONS = [
    {
        label: 'Red',
        value: 'red'
    },
    {
        label: 'Green',
        value: 'green'
    },
    {
        label: 'Blue',
        value: 'blue'
    }
];

describe('SingleSelectFilter', () => {
    it('returns the proper label', () => {
        const label = 'label';
        expect(SingleSelectFilter({ label }, {})).toMatchObject({ label });
    });

    it('returns the proper description', () => {
        const description = 'description';
        expect(SingleSelectFilter({ description }, {})).toMatchObject({ description });
    });

    describe('getApiQueryUrl', () => {
        const { getApiQueryUrl } = SingleSelectFilter({ defaultValue: '' }, {});

        it('returns the proper url', () => {
            expect(getApiQueryUrl('a', 'first name')).toBe('&a=first%20name');
        });
        
        it('returns an empty string when value is falsy', () => {
            expect(getApiQueryUrl('a', '')).toBe('');
            expect(getApiQueryUrl('a', null)).toBe('');
            expect(getApiQueryUrl('a', 0)).toBe('');
            expect(getApiQueryUrl('a')).toBe('');
        });
    });

    describe('getApiPostBody', () => {
        const { getApiPostBody } = SingleSelectFilter({}, {});

        it('returns the proper object when there is a value', () => {
            expect(getApiPostBody('a', 'first name')).toMatchObject({ a: 'first name' });
        });

        it('returns undefined when value is falsy', () => {
            expect(getApiPostBody('a', '')).toBeUndefined();
            expect(getApiPostBody('a', null)).toBeUndefined();
            expect(getApiPostBody('a', 0)).toBeUndefined();
            expect(getApiPostBody('a')).toBeUndefined();
        });
    });

    describe('getBrowserQueryUrlValue', () => {
        const { getBrowserQueryUrlValue } = SingleSelectFilter({}, {});

        it('returns the provided value when truthy value is provided', () => {
            expect(getBrowserQueryUrlValue('a')).toBe('a');
            expect(getBrowserQueryUrlValue(1)).toBe(1);
            expect(getBrowserQueryUrlValue()).toBeUndefined();
        });
    });

    describe('getDefaultFilterValue', () => {
        const { getDefaultFilterValue } = SingleSelectFilter({}, {});

        it('returns an empty string', () => {
            expect(getDefaultFilterValue('a')).toBe('');
            expect(getDefaultFilterValue(1)).toBe('');
            expect(getDefaultFilterValue()).toBe('');
        });
    });

    describe('isDefaultFilterValue', () => {
        const { isDefaultFilterValue } = SingleSelectFilter({}, {});

        it('returns true if value is empty string', () => {
            expect(isDefaultFilterValue('')).toBe(true);
            expect(isDefaultFilterValue('a')).toBe(false);
            expect(isDefaultFilterValue()).toBe(false);
        });
    });

    describe('getFilterBarLabel', () => {
        it('returns filterLabelPrefix and value when filterLabelPrefix is provided', () => {
            const { getFilterBarLabel } = SingleSelectFilter({ options: SINGLE_SELECT_FILTER_OPTIONS, filterLabelPrefix: 'value' }, {});
            expect(getFilterBarLabel(SINGLE_SELECT_FILTER_OPTIONS[0].value)).toBe(`value: ${SINGLE_SELECT_FILTER_OPTIONS[0].value}`);
        });
        
        it('returns stringified value when filterLabelPrefix is falsy', () => {
            const { getFilterBarLabel } = SingleSelectFilter({ options: SINGLE_SELECT_FILTER_OPTIONS }, {});
            expect(getFilterBarLabel(SINGLE_SELECT_FILTER_OPTIONS[0].value)).toBe(SINGLE_SELECT_FILTER_OPTIONS[0].value);
            expect(getFilterBarLabel(1)).toBe('1');
        });
    });

    describe('getFilterSectionLabel', () => {
        it('returns stringified value provided', () => {
            const { getFilterSectionLabel } = SingleSelectFilter({ options: SINGLE_SELECT_FILTER_OPTIONS, filterLabelPrefix: 'value' }, {});
            expect(getFilterSectionLabel(SINGLE_SELECT_FILTER_OPTIONS[0].value)).toBe(SINGLE_SELECT_FILTER_OPTIONS[0].value);
            expect(getFilterSectionLabel(1)).toBe('1');
        });
    });

    describe('parseInitialFilterValue', () => {
        const { parseInitialFilterValue } = SingleSelectFilter({ initialValue: '' }, {});

        it('returns value if value is truthy', () => {
            expect(parseInitialFilterValue('a')).toBe('a');
            expect(parseInitialFilterValue(1)).toBe(1);
        });

        it('returns initialValue if value is falsy', () => {
            expect(parseInitialFilterValue('')).toBe('');
            expect(parseInitialFilterValue(null)).toBe('');
            expect(parseInitialFilterValue(0)).toBe('');
            expect(parseInitialFilterValue()).toBe('');
        });
    });

    describe('renderComponent', () => {
        const { renderComponent } = SingleSelectFilter({ options: SINGLE_SELECT_FILTER_OPTIONS }, {});

        it('returns the expected component', () => {
            const update = () => null;
            const { container } = render(<div>{renderComponent({ name: 'name', value: '1', update })}</div>);
            expect(container.querySelectorAll('option')).toHaveLength(4);
        });
    });

    describe('getFilterValueFromApiPostBody', () => {
        const { getFilterValueFromApiPostBody } = SingleSelectFilter({}, {});

        it('removes value at specified post body key and returns filterValue', () => {
            const postBody = { a: 1 };
            expect(postBody).toMatchObject({ a: 1 });
            expect(getFilterValueFromApiPostBody('a', postBody)).toBe(1);
            expect(postBody).not.toMatchObject({ a: 1 });
        });

        it('returns empty string if post body does not contain key', () => {
            expect(getFilterValueFromApiPostBody('a', {})).toBe('');
        });

        it('returns empty string if post body is falsy', () => {
            expect(getFilterValueFromApiPostBody('a', null)).toBe('');
            expect(getFilterValueFromApiPostBody('a')).toBe('');
        });
    });

    describe('radioFilterOptions', () => {
        const filterModuleKeys = [
            'label',
            'description',
            'getApiQueryUrl',
            'getApiPostBody',
            'getBrowserQueryUrlValue',
            'getDefaultFilterValue',
            'isDefaultFilterValue',
            'getFilterBarLabel',
            'getFilterSectionLabel',
            'parseInitialFilterValue',
            'renderComponent',
            'getFilterValueFromApiPostBody',
            'required'
        ];

        const {
            label,
            description,
            getApiQueryUrl,
            getApiPostBody,
            getBrowserQueryUrlValue,
            getDefaultFilterValue,
            isDefaultFilterValue,
            getFilterBarLabel,
            getFilterSectionLabel,
            parseInitialFilterValue,
            renderComponent,
            getFilterValueFromApiPostBody,
            required
        } = SingleSelectFilter(
            {
                label: 'label',
                description: 'description'
            },
            filterModuleKeys.reduce((acc, k) => ({ ...acc, [k]: () => null }), {})
        );

        it('does not override label and description', () => {
            expect(label).toBe('label');
            expect(description).toBe('description');
            expect(required).toBeUndefined();
        });

        it('overrides default methods', () => {
            expect(getApiQueryUrl('a', 'b')).toBeNull();
            expect(getApiPostBody('a', 'b')).toBeNull();
            expect(getBrowserQueryUrlValue('a')).toBeNull();
            expect(getDefaultFilterValue('a')).toBeNull();
            expect(isDefaultFilterValue('a')).toBeNull();
            expect(getFilterBarLabel('a')).toBeNull();
            expect(getFilterSectionLabel('a')).toBeNull();
            expect(parseInitialFilterValue('a')).toBeNull();
            expect(getFilterValueFromApiPostBody('a', {})).toBeNull();

            const { container } = render(
                <div>{renderComponent({ name: 'name', value: '1', update: () => null })}</div>
            );
            expect(container.querySelectorAll('option')).toHaveLength(0);
        });
    });
});

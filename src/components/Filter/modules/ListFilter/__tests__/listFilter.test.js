import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import ListFilter from '../ListFilter';
import { listFilterOptions } from 'src/stories/Filter/ListFilter/listFilterUtil';

const options = [
    {
        label: 'Test 1',
        value: 'test 1'
    },
    {
        label: 'Test 2',
        value: 'test 2'
    }
];

describe('ListFilter', () => {
    it('returns the proper label', () => {
        const label = 'label';
        expect(ListFilter(options, label, '')).toMatchObject({ label });
    });

    it('returns the proper description', () => {
        const description = 'description';
        expect(ListFilter(options, '', description)).toMatchObject({ description });
    });

    describe('getFilterCount', () => {
        const { getFilterCount } = ListFilter(options, '', '');

        it('returns the the value size', () => {
            expect(getFilterCount(new Set([1, 2, 3]))).toBe(3);
        });

        it('returns 0 when a falsy value is provided', () => {
            expect(getFilterCount(null)).toBe(0);
            expect(getFilterCount()).toBe(0);
        });
    });

    describe('getApiQueryUrl', () => {
        it('returns the proper url when initialValue and option values are equal', () => {
            const { getApiQueryUrl } = ListFilter(options, '', '', { initialValue: options.map(initial => initial.value) });
            const setValue = new Set(options.map(initial => initial.value));
            expect(getApiQueryUrl('a', setValue)).toBe('&a=test+1&a=test+2');
        });

        it('returns an empty url when no initialValue is provided and the current setValue === length of options', () => {
            const { getApiQueryUrl } = ListFilter(options, '', '', {});
            expect(getApiQueryUrl('a', new Set(options))).toBe('');
        });

        it('returns the proper url when there is a value with no initialValue', () => {
            const { getApiQueryUrl } = ListFilter(options, '', '');
            expect(getApiQueryUrl('a', new Set(['first name']))).toBe('&a=first+name');
        });

        it('returns empty url when key && value are undefined', () => {
            const { getApiQueryUrl } = ListFilter(options, '', '');
            expect(getApiQueryUrl(undefined, undefined)).toBe('');
        });

        it('returns empty url when value is undefined', () => {
            const { getApiQueryUrl } = ListFilter(options, '', '');
            expect(getApiQueryUrl('a', undefined)).toBe('');
        });

        it('returns undefined url when key is undefined', () => {
            const { getApiQueryUrl } = ListFilter(options, '', '');
            expect(getApiQueryUrl(undefined, new Set(['a']))).toBe('&undefined=a');
        });

        it('returns an empty string when value is falsy', () => {
            const { getApiQueryUrl } = ListFilter(options, '', '');
            expect(getApiQueryUrl('a', '')).toBe('');
            expect(getApiQueryUrl('a', null)).toBe('');
        });
    });

    describe('getApiPostBody', () => {
        const { getApiPostBody } = ListFilter(options, '', '');

        it('returns the proper object when there is a value', () => {
            const testSet = new Set().add('first name');
            const expected = { a: ['first name'] };

            expect(getApiPostBody('a', testSet)).toMatchObject(expected);
        });

        it('returns an undefined when value is falsy', () => {
            expect(getApiPostBody('a', '')).toBeUndefined();
            expect(getApiPostBody('a', null)).toBeUndefined();
            expect(getApiPostBody('a', 0)).toBeUndefined();
            expect(getApiPostBody('a')).toBeUndefined();
        });
    });

    describe('getBrowserQueryUrlValue', () => {
        const { getBrowserQueryUrlValue } = ListFilter(options, '', '');

        it('returns an array from value when truthy value is provided', () => {
            expect(getBrowserQueryUrlValue(new Set(['a']))).toMatchObject(['a']);
            expect(getBrowserQueryUrlValue(new Set([1, 2]))).toMatchObject([1, 2]);
            expect(getBrowserQueryUrlValue(new Set([]))).toMatchObject([]);
        });

        it('returns undefined when falsy value is provided', () => {
            expect(getBrowserQueryUrlValue()).toBeUndefined();
        });
    });

    describe('getDefaultFilterValue', () => {
        it('returns a default set when initialValue is provided', () => {
            const { getDefaultFilterValue } = ListFilter(options, '', '', { initialValue: options[0].value });
            const defaultValues = new Set([options[0].value]);

            expect(getDefaultFilterValue('a')).toStrictEqual(defaultValues);
            expect(getDefaultFilterValue(1)).toStrictEqual(defaultValues);
            expect(getDefaultFilterValue()).toStrictEqual(defaultValues);
        });

        it('returns a default set when initialValue is not provided', () => {
            const { getDefaultFilterValue } = ListFilter(options, '', '');

            expect(getDefaultFilterValue()).toStrictEqual(new Set([options[0].value, options[1].value]));
        });
    });

    describe('isDefaultFilterValue', () => {
        it('returns true if value is equal to empty string or empty Set', () => {
            const { isDefaultFilterValue } = ListFilter(options, '', '');
            const defaultValues = new Set([options[0].value, options[1].value]);

            expect(isDefaultFilterValue(defaultValues)).toBe(true);
            expect(isDefaultFilterValue('a')).toBe(false);
            expect(isDefaultFilterValue()).toBe(false);
            expect(isDefaultFilterValue(new Set(null))).toBe(true);
        });

        it('returns true when value and initialValue are truthy', () => {
            const { isDefaultFilterValue } = ListFilter(options, '', '', { initialValue: [options[0].value, options[1].value] });
            const defaultValues = new Set(['test 1', 'test 2']);

            expect(isDefaultFilterValue(defaultValues)).toBe(true);
        });

        it('returns false when value and initialValue are falsy', () => {
            const { isDefaultFilterValue } = ListFilter(options, '', '', { initialValue: [options[0].value, options[1].value] });
            const defaultValues = new Set(['a', 'b']);

            expect(isDefaultFilterValue(defaultValues)).toBe(false);
        });
    });

    describe('getFilterBarLabel', () => {
        const { getFilterBarLabel } = ListFilter(options, '', '');
        const allOptions = new Set([options[0].value, options[1].value]);
        const oneOption = new Set([options[0].value]);

        it('returns the value provided', () => {
            expect(getFilterBarLabel(allOptions)).toBe('Test 1,Test 2');
            expect(getFilterBarLabel(oneOption)).toBe('Test 1');
            expect(getFilterBarLabel()).toBe('');
        });
    });

    describe('getFilterSectionLabel', () => {
        const { getFilterSectionLabel } = ListFilter(options, '', '');
        const allOptions = new Set([options[0].value, options[1].value]);
        const oneOption = new Set([options[0].value]);

        it('returns array of values provided', () => {
            expect(getFilterSectionLabel(allOptions)).toMatchObject(['Test 1', 'Test 2']);
            expect(getFilterSectionLabel(oneOption)).toMatchObject(['Test 1']);
        });

        it('returns empty array by default', () => {
            expect(getFilterSectionLabel()).toMatchObject([]);
        });
    });

    describe('parseInitialFilterValue', () => {
        const { parseInitialFilterValue } = ListFilter(options, '', '');
        const allOptions = new Set([options[0].value, options[1].value]);
        const oneOption = new Set([options[0].value]);

        it('returns value if value is truthy', () => {
            expect(parseInitialFilterValue('a')).toStrictEqual(new Set(['a']));
            expect(parseInitialFilterValue([1])).toStrictEqual(new Set([1]));
        });

        it('returns empty string if value is falsy', () => {
            expect(parseInitialFilterValue('')).toStrictEqual(allOptions);
            expect(parseInitialFilterValue(null)).toStrictEqual(allOptions);
            expect(parseInitialFilterValue(0)).toStrictEqual(allOptions);
            expect(parseInitialFilterValue()).toStrictEqual(allOptions);
        });
    });

    describe('renderComponent', () => {
        const { renderComponent } = ListFilter(options, '', '');

        it('returns the expected component', () => {
            const update = jest.fn();
            const selected = new Set([options[0].value]);
            const { getByLabelText } = render(<div>{renderComponent({ name: 'name', value: selected, update })}</div>);

            expect(getByLabelText('Test 1')).toBeChecked();
            fireEvent.click(getByLabelText('Test 1'));

            // Nothing is selected now, so it is called with an empty Set
            expect(update).toBeCalledWith(new Set());
            fireEvent.click(getByLabelText('Test 1'));
            expect(update).toBeCalledWith(selected);
        });
    });

    describe('listFilterOptions', () => {
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
        } = ListFilter(
            options,
            'label',
            'description',
            {},
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

            const { queryByRole } = render(
                <div>{renderComponent({ name: 'name', value: '1', update: () => null })}</div>
            );
            expect(queryByRole('label')).not.toBeInTheDocument();
        });
    });

    describe('clearPartialSingleFilter', () => {
        const options = [{ value: 'a', label: 'A [b]' }, { value: 'b', label: 'B [a]' }];
        const { clearPartialSingleFilter } = ListFilter(options, '', '');
        const allOptions = new Set([options[0].value, options[1].value]);

        it('clears part of the filter if value exists', () => {
            const result = clearPartialSingleFilter(allOptions, options[0].label);
            expect(result.size).toBe(1);
            expect(result.has(options[1].value)).toBe(true);
            expect(result.has(options[0].value)).toBe(false);
        });

        it('returns original Set when selectedLabel is not provided', () => {
            const result = clearPartialSingleFilter(allOptions, '');
            expect(result.size).toBe(2);
            expect(result.has(options[0].value)).toBe(true);
            expect(result.has(options[1].value)).toBe(true);
        });
    });
});

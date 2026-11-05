import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import AdditionalJSONFilter from '../AdditionalJSONFilter';
import { ADDITIONAL_JSON_FILTER_BAR_LABEL, ADDITIONAL_JSON_FILTER_LABEL } from '../additionalJSONFilterUtil';

describe('AdditionalJSONFilter', () => {
    it('returns the proper label', () => {
        expect(AdditionalJSONFilter()).toMatchObject({ label: ADDITIONAL_JSON_FILTER_LABEL });
    });

    it('defaults to input hidden', () => {
        expect(AdditionalJSONFilter()).toMatchObject({ inputHidden: true });
    });

    describe('getApiQueryUrl', () => {
        const { getApiQueryUrl } = AdditionalJSONFilter();

        it('returns an empty string', () => {
            expect(getApiQueryUrl()).toBe('');
        });
    });

    describe('getApiPostBody', () => {
        const { getApiPostBody } = AdditionalJSONFilter();

        it('returns the value provided', () => {
            const arr = [];
            const obj = {};

            expect(getApiPostBody(undefined, 1)).toBe(1);
            expect(getApiPostBody(undefined, arr)).toBe(arr);
            expect(getApiPostBody(undefined, obj)).toBe(obj);
        });
    });

    describe('getBrowserQueryUrlValue', () => {
        const { getBrowserQueryUrlValue } = AdditionalJSONFilter();

        it('returns JSON stringified value if value is an actual value', () => {
            expect(getBrowserQueryUrlValue({ a: 1 })).toBe(JSON.stringify({ a: 1 }));
            expect(getBrowserQueryUrlValue([1])).toBe(JSON.stringify([1]));
        });

        it('returns undefined if value is not an actual value', () => {
            expect(getBrowserQueryUrlValue()).toBeUndefined();
            expect(getBrowserQueryUrlValue(1)).toBeUndefined();
            expect(getBrowserQueryUrlValue([])).toBeUndefined();
        });
    });

    describe('getDefaultFilterValue', () => {
        const { getDefaultFilterValue } = AdditionalJSONFilter();

        it('returns undefined', () => {
            expect(getDefaultFilterValue()).toBeUndefined();
        });
    });

    describe('isDefaultFilterValue', () => {
        const { isDefaultFilterValue } = AdditionalJSONFilter();

        it('returns false if value is actual value', () => {
            expect(isDefaultFilterValue({ a: 1 })).toBe(false);
            expect(isDefaultFilterValue([1])).toBe(false);
        });

        it('returns true if value is not actual value', () => {
            expect(isDefaultFilterValue('')).toBe(true);
            expect(isDefaultFilterValue({})).toBe(true);
            expect(isDefaultFilterValue([])).toBe(true);
        });
    });

    describe('getFilterBarLabel', () => {
        const { getFilterBarLabel } = AdditionalJSONFilter();

        it(`returns ${ADDITIONAL_JSON_FILTER_BAR_LABEL} if value is truthy`, () => {
            expect(getFilterBarLabel('a')).toBe(ADDITIONAL_JSON_FILTER_BAR_LABEL);
            expect(getFilterBarLabel(1)).toBe(ADDITIONAL_JSON_FILTER_BAR_LABEL);
            expect(getFilterBarLabel({})).toBe(ADDITIONAL_JSON_FILTER_BAR_LABEL);
        });

        it('returns empty string if value is falsy', () => {
            expect(getFilterBarLabel('')).toBe('');
            expect(getFilterBarLabel(0)).toBe('');
            expect(getFilterBarLabel(null)).toBe('');
            expect(getFilterBarLabel()).toBe('');
        });
    });

    describe('getFilterSectionLabel', () => {
        const { getFilterSectionLabel } = AdditionalJSONFilter();

        it(`returns ${ADDITIONAL_JSON_FILTER_BAR_LABEL} if value is truthy`, () => {
            expect(getFilterSectionLabel('a')).toBe(ADDITIONAL_JSON_FILTER_BAR_LABEL);
            expect(getFilterSectionLabel(1)).toBe(ADDITIONAL_JSON_FILTER_BAR_LABEL);
            expect(getFilterSectionLabel({})).toBe(ADDITIONAL_JSON_FILTER_BAR_LABEL);
        });

        it('returns empty string if value is falsy', () => {
            expect(getFilterSectionLabel('')).toBe('');
            expect(getFilterSectionLabel(0)).toBe('');
            expect(getFilterSectionLabel(null)).toBe('');
            expect(getFilterSectionLabel()).toBe('');
        });
    });

    describe('parseInitialFilterValue', () => {
        const { parseInitialFilterValue } = AdditionalJSONFilter();

        it('returns JSON parsed value if value is truthy', () => {
            expect(parseInitialFilterValue('{"a":1}')).toMatchObject({ a: 1 });
            expect(parseInitialFilterValue('{"a":[1, 2]}')).toMatchObject({ a: [1, 2] });
        });

        it('returns undefined if value is falsy', () => {
            expect(parseInitialFilterValue('')).toBeUndefined();
            expect(parseInitialFilterValue(0)).toBeUndefined();
            expect(parseInitialFilterValue(null)).toBeUndefined();
            expect(parseInitialFilterValue()).toBeUndefined();
        });
    });

    describe('renderComponent', () => {
        const { renderComponent } = AdditionalJSONFilter();

        it('returns an empty component', () => {
            const { container, debug } = render(<div>{renderComponent()}</div>);

            expect(container.querySelectorAll('div')).toHaveLength(1);
        });
    });

    describe('additionalJSONFilterOptions', () => {
        const filterModuleKeys = [
            'label',
            'inputHidden',
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
        const OVERRIDE_RENDER = 'overrideRender';
        const {
            label,
            inputHidden,
            getApiQueryUrl,
            getApiPostBody,
            getBrowserQueryUrlValue,
            getDefaultFilterValue,
            isDefaultFilterValue,
            getFilterBarLabel,
            getFilterSectionLabel,
            parseInitialFilterValue,
            renderComponent
        } = AdditionalJSONFilter({
            ...filterModuleKeys.reduce((acc, k) => ({ ...acc, [k]: () => null }), {}),
            renderComponent: () => <div>{OVERRIDE_RENDER}</div>
        });

        it('overrides default values and methods', () => {
            expect(typeof label).toBe('function');
            expect(typeof inputHidden).toBe('function');
            expect(getApiQueryUrl()).toBeNull();
            expect(getApiPostBody('a', 'b')).toBeNull();
            expect(getBrowserQueryUrlValue('a')).toBeNull();
            expect(getDefaultFilterValue('a')).toBeNull();
            expect(isDefaultFilterValue('a')).toBeNull();
            expect(getFilterBarLabel('a')).toBeNull();
            expect(getFilterSectionLabel('a')).toBeNull();
            expect(parseInitialFilterValue('a')).toBeNull();

            const { getByText } = render(<div>{renderComponent()}</div>);
            getByText(OVERRIDE_RENDER);
        });
    });
});

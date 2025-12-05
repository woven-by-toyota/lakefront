import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import { DurationFilter } from '../DurationFilter';

describe('DurationFilter', () => {
    it('returns the proper label', () => {
        const label = 'label';
        expect(DurationFilter({ label: label, description: '' })).toMatchObject({ label });
    });

    it('returns the proper description', () => {
        const description = 'description';
        expect(DurationFilter({ label: '', description: description })).toMatchObject({ description });
    });

    describe('getApiQueryUrl', () => {
        const { getApiQueryUrl } = DurationFilter({ label: '', description: '' });

        it('returns the proper url when there is a value', () => {
            expect(getApiQueryUrl(0, { min: 1, max: 2 })).toBe('&duration.min=60&duration.max=120');
        });

        it('returns an empty string when value is falsy', () => {
            expect(getApiQueryUrl('a', '')).toBe('');
            expect(getApiQueryUrl('a', null)).toBe('');
            expect(getApiQueryUrl('a', 0)).toBe('');
            expect(getApiQueryUrl('a')).toBe('');
        });
    });

    describe('getApiPostBody', () => {
        const { getApiPostBody } = DurationFilter({ label: '', description: '' });

        it('returns the proper object when there is a value', () => {
            expect(getApiPostBody('a', { min: 1, max: 2 })).toMatchObject({ 'duration.min': 60, 'duration.max': 120 });
        });

        it('returns an undefined when value is falsy', () => {
            expect(getApiPostBody('a', '')).toBeUndefined();
            expect(getApiPostBody('a', null)).toBeUndefined();
            expect(getApiPostBody('a', 0)).toBeUndefined();
            expect(getApiPostBody('a')).toBeUndefined();
        });
    });

    describe('getBrowserQueryUrlValue', () => {
        const { getBrowserQueryUrlValue } = DurationFilter({ label: '', description: '' });

        it('returns the value provided', () => {
            expect(getBrowserQueryUrlValue({ min: 1, max: 6 })).toBe('1~6');
            expect(getBrowserQueryUrlValue({ min: 1 })).toBe('1~');
            expect(getBrowserQueryUrlValue()).toBe('');
        });
    });

    describe('getDefaultFilterValue', () => {
        const { getDefaultFilterValue } = DurationFilter({ label: '', description: '' });

        it('returns null', () => {
            expect(getDefaultFilterValue('a')).toBe(null);
            expect(getDefaultFilterValue(1)).toBe(null);
            expect(getDefaultFilterValue()).toBe(null);
        });
    });

    describe('isDefaultFilterValue', () => {
        const { isDefaultFilterValue } = DurationFilter({ label: '', description: '' });

        it('returns true only if value is null', () => {
            expect(isDefaultFilterValue('')).toBe(false);
            expect(isDefaultFilterValue('a')).toBe(false);
            expect(isDefaultFilterValue(null)).toBe(true);
        });
    });

    describe('getFilterBarLabel', () => {
        const { getFilterBarLabel } = DurationFilter({ label: '', description: '' });

        it('returns the value provided', () => {
            expect(getFilterBarLabel({ min: 1, max: 6 })).toBe('Duration: 1 - 6 mins');
            expect(getFilterBarLabel(1)).toBe("Duration: 0 -  mins");
            expect(getFilterBarLabel()).toBe("");
        });
    });

    describe('getFilterSectionLabel', () => {
        const { getFilterSectionLabel } = DurationFilter({ label: '', description: '' });

        it('returns the value provided', () => {
            expect(getFilterSectionLabel({ min: 1, max: 6 })).toBe('1 - 6 mins');
            expect(getFilterSectionLabel(1)).toBe('0 -  mins');
            expect(getFilterSectionLabel()).toBe('');
        });
    });

    describe('parseInitialFilterValue', () => {
        const { parseInitialFilterValue } = DurationFilter({ label: '', description: '' });

        it('returns value if value is truthy', () => {
            expect(parseInitialFilterValue('1~6')).toStrictEqual({ "max": "6", "min": "1" });
            expect(parseInitialFilterValue('1~')).toStrictEqual({ "min": "1", "max": "" });
            expect(parseInitialFilterValue()).toBe(null);
        });

    });

    describe('renderComponent', () => {
        it('returns the expected component', () => {
            const { renderComponent } = DurationFilter({ label: '', description: '' });

            const update = jest.fn();
            const { container } = render(<div>{renderComponent({ value: { min: 1, max: 5 }, update })}</div>);
            expect(container.querySelectorAll('input')[0]).toHaveValue(1);
            fireEvent.blur(container.querySelectorAll('input')[0], { target: { value: 2 } });
            expect(update).toBeCalledTimes(2);
        });
    });

});

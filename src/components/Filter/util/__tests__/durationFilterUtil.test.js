import { getMinMaxFromKey, validateNumber } from '../durationFilterUtil';

describe('getMinMaxFromKey', () => {
    it('returns min and max value', () => {
        expect(getMinMaxFromKey('1~6')).toStrictEqual({ 'max': '6', 'min': '1' });
    });

    it('returns undefined when nothing is passed', () => {
        expect(getMinMaxFromKey('')).toBe(undefined);
    });
});


describe('validateNumber', () => {
    it('returns false for negative number', () => {
        expect(validateNumber(-1, false)).toBe(false);
    });

    it('returns true for positive number', () => {
        expect(validateNumber(1, false)).toBe(true);
    });
});

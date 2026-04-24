import { COLORS, InvalidButtonColorError, shouldUseMappedIcon } from '../buttonUtil';

describe('InvalidButtonColorError', () => {
    it('throws the correct error', () => {
        const color = 'black';

        expect(() => { throw new InvalidButtonColorError(color); }).toThrow(
            `Invalid color '${color}' was provided. Valid colors are: ${Object.values(COLORS).join(', ')}.`
        );
    });
});

describe('shouldUseMappedIcon', () => {
    it('returns true if icon is strictly true', () => {
        expect(shouldUseMappedIcon(true)).toBe(true);
    });

    it('returns false if icon is not strictly true', () => {
        expect(shouldUseMappedIcon('add')).toBe(false);
        expect(shouldUseMappedIcon('true')).toBe(false);
        expect(shouldUseMappedIcon()).toBe(false);
        expect(shouldUseMappedIcon({})).toBe(false);
        expect(shouldUseMappedIcon(false)).toBe(false);
    });
});

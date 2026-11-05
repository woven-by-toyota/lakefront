import {
    addDistanceLabel,
    digitGroupSeparator,
    formatBytes,
    formatCelsiusTemperature,
    formatLatLong,
    formatNumber,
    humanize,
    humanizeCamelCase,
    pascalToCamelCase
} from '../format';

describe('format', () => {
    const units = {
        speedUnit: 'mph',
        singleUnit: 'mile',
        distanceUnit: 'miles',
        distanceAbbrvUnit: 'mi'
    };

    describe('addDistanceLabel()', () => {
        it('will add the word mile to distance 1', () => {
            const dist = 1;
            const output = addDistanceLabel(dist, units);
            expect(output).toBe('1 mi');
        });

        it('will add the word miles to distance other than 1', () => {
            const dist = 12;
            const output = addDistanceLabel(dist, units);
            expect(output).toBe('12 mi');
        });
    });

    it('digitGroupSeparator', () => {
        expect(digitGroupSeparator(5432)).toBe('5,432');
        expect(digitGroupSeparator('hello')).toBe('0');
        expect(digitGroupSeparator({})).toBe('0');
    });

    it('formatNumber', () => {
        expect(formatNumber(12345.123456789, 3)).toBe('12345.123');

        // check if number is rounded up to the last digit
        expect(formatNumber(12345.123219, 5)).toBe('12345.12322');
    });

    it('humanize', () => {
        expect(humanize('humpy_dumpy')).toBe('Humpy Dumpy');

        expect(humanize('humpy-dumpy')).toBe('Humpy Dumpy');
    });

    it('pascalToCamelCase', () => {
        expect(pascalToCamelCase('VERSION_INFO')).toBe('versionInfo');

        expect(pascalToCamelCase('ROBOTS')).toBe('robots');
    });

    describe('formatBytes', () => {
        it('should format to large tb', () => {
            const largeTB = formatBytes(69531149402112);

            expect(largeTB.value).toBe('63.24');
            expect(largeTB.size).toBe('TB');
        });

        it('should show TB instead of GB', () => {
            const num = formatBytes(1099511496704);

            expect(num.value).toBe('1.00');
            expect(num.size).toBe('TB');
        });

        it('should still show TB instead of GB', () => {
            const num = formatBytes(1099511627776);

            expect(num.value).toBe('1.00');
            expect(num.size).toBe('TB');
        });

        it('should not include the full name in bytes if parameter is left undefined', () => {
            const num = formatBytes(1099511627776, 2);

            expect(num.fullSize).toBeUndefined();
        });
    });

    describe('formatLatLong', () => {
        it('should format a valid lat/long number to 5 decimal places', () => {
            const numLong = 1.123456789;
            const numShort = 1.12;
            const numExact = 1.12345;
            const formattedLong = formatLatLong(numLong);
            const formattedShort = formatLatLong(numShort);
            const formattedExact = formatLatLong(numExact);

            expect(formattedLong).toBe('1.12345');
            expect(formattedShort).toBe('1.12');
            expect(formattedExact).toBe('1.12345');
        });

        it('should return an empty string when no value provided', () => {
            const num = null;
            const formatted = formatLatLong(num);

            expect(formatted).toBe('');
        });
    });

    describe('formatCelsiusTemperature', () => {
        const degreesCelsius = 100;

        it('outputs 0° C by default', () => {
            expect(formatCelsiusTemperature()).toBe('0° C');
        });

        it('outputs the proper celcius string value when provided no measurement system', () => {
            expect(formatCelsiusTemperature(degreesCelsius)).toBe('100° C');
        });

        it('outputs the proper fahrenheit string value when provided the imperial measurement system', () => {
            expect(formatCelsiusTemperature(degreesCelsius, 'imperial')).toBe('212° F');
        });
    });

    describe('humanize camelCase', () => {
        it('converts thisStringIsGood to This String Is Good', () => {
            expect(humanizeCamelCase('thisStringIsGood')).toBe('This String Is Good');
        });

        it('leaves an empty string as an empty string', () => {
            expect(humanizeCamelCase()).toBe('');
        });
    });
});

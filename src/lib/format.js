/**
 * Function to add miles label to distance
 * @param {number} distance - The distance
 * @param {object} unit - The object returned from systemToUnits.js
 * @returns {string}
 */
export const addDistanceLabel = (distance = 0, unit) => {
    return `${distance} ${unit.distanceAbbrvUnit}`;
};

/**
 * Capitalize first letter of string
 * @param {string} string - The string to capitalize first letter
 * @returns {string}
 */
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const pascalToCamelCase = (str) => {
    return str
        .split('_')
        .map((word, index) => {
            // If it is the first word make sure to lowercase all the chars.
            if (index === 0) {
                return word.toLowerCase();
            }
            // If it is not the first word only upper case the first char and lowercase the rest.
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
};

// turn humpdey_dumpdey into Humpdey Dumpdey
export const humanize = (str) => {
    const frags = str.split('_').join(', ').split('-').join(', ').split(', ');
    for (let i = 0; i < frags.length; i++) {
        frags[i] = capitalizeFirstLetter(frags[i].toLowerCase());
    }
    return frags.join(' ');
};

/**
 * Pretty print numbers
 * @param number
 * @return {string}
 */
export const digitGroupSeparator = (number) => {
    if (number && typeof number === 'number') {
        return number.toLocaleString();
    }
    return '0';
};

/**
 * Round the number to the precision specified
 */
export const formatNumber = (number, precision) => Number.parseFloat(number).toFixed(precision);

export const pluralize = (word, num) => (num === 1 ? word : `${word}s`);

/**
 * Return the optimal number and the size label for data in bytes
 * https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
 */
export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0 || bytes === undefined) return { value: 0, size: 'B' };

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    let i = Math.floor(Math.log(bytes) / Math.log(k));

    let value = (bytes / k ** i).toFixed(dm);
    let size = sizes[i];

    if (value === k.toFixed(dm)) {
        i = i + 1;

        value = (bytes / k ** i).toFixed(dm);
        size = sizes[i];
    }

    return { value: value, size: size };
};

/**
 * Formats Latitude and Longitude numbers to a uniform decimal place without rounding on truncation
 * @param {number} value - The lat/long value to format
 * @returns {string}
 */
export const formatLatLong = (value) => {
    if (!value) return '';
    const [integerPart, fractionalPart] = value.toString().split('.');

    return `${integerPart}.${fractionalPart.substring(0, 5)}`;
};

/**
 * Receives a celsius temperature and returns a properly formatted temperature string
 * with degree symbol. An optional measurementSystem param can be provided to output
 * as Fahrenheit.
 * @param {number} celsiusTemp - The temperature in celsius
 * @param {string} [measurementSystem="metric"] - The output measurement system
 * @returns {string}
 */
export const formatCelsiusTemperature = (celsiusTemp = 0, measurementSystem = 'metric') => {
    let unit = 'C';
    let temp = celsiusTemp;

    if (measurementSystem === 'imperial') {
        unit = 'F';
        temp = temp * (9 / 5) + 32;
    }

    return `${Math.round(temp)}° ${unit}`;
};

/**
 * Receives a camelCase string and returns a properly formatted human-readable string.
 * @param strToConvert
 * @returns {string}
 */
export const humanizeCamelCase = (strToConvert = '') => {
    return strToConvert.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
};

export const camalize = (strToConvert = '') => {
    return strToConvert.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

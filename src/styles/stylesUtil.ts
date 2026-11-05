/**
 * Function can be used to lighten or darken
 * a color defined by it's hex value.
 */
export const lightenDarkenColor = (hexColor = '', percent: number): string => {
    let usePound = false;

    // Clamp the percent to -100 or 100
    const validPercent = percent >= 0 ? Math.min(percent, 100) : Math.max(percent, -100);

    // The amount we change R, G, and B by is the decimal percent of 256, or the whole RGB range
    const amt = (validPercent / 100) * 256;

    // Determines if there's already a pound in the hexColor param, and if so, keep it in the final return value
    if (hexColor[0] === '#') {
        hexColor = hexColor.slice(1);
        usePound = true;
    }

    // Parse the hexColor into a hex number
    const parsedNum = parseInt(hexColor, 16);
    const num = isNaN(parsedNum) ? 0 : parsedNum;

    // Bit shift and Bit AND the values to add our lighten or darken amount
    const r = Math.max(Math.min((num >> 16) + amt, 255), 0);
    const b = Math.max(Math.min(((num >> 8) & 0x00ff) + amt, 255), 0);
    const g = Math.max(Math.min((num & 0x0000ff) + amt, 255), 0);

    const value = (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);

    // Pad the string if there isn't enough data to make a whole hex color string
    const outputLength = usePound ? 7 : 6;
    return value.length === outputLength ? value : value.padEnd(outputLength, '0');
};

/**
 * Takes a hex string and an optional opacity value and returns an rgb or rgba string.
 */
export const hexToRgb = (hex: string, opacity?: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const rgb = result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          }
        : null;

    const rgbString = `${rgb?.r},${rgb?.g},${rgb?.b}`;
    const fnString = opacity ? 'rgba(' : 'rgb(';

    return rgb ? `${fnString}${rgbString}${opacity ? ',' + opacity : ''})` : '';
};

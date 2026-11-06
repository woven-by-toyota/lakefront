import type { MinMax } from 'src/components/Filter/modules/DurationFilter/MinMaxInput';

export const getMinMaxFromKey = (key: any): MinMax | undefined => {
    const [min, max] = key.split('~');

    if (min || max) {
        return { min, max };
    }

    return undefined;
};

export const validateNumber = (num: number, allowNegatives: boolean) => {
    // negative number validation
    const parsed = Number(num);
    if (!allowNegatives && !isNaN(parsed)) {
        return num >= 0;
    }

    // input type number does the number verification for us automatically
    return true;
};

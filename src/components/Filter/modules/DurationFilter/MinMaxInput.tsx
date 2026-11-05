import { type FC, useEffect, useState } from 'react';

import Input from 'src/components/Input/Input';
import useDebounce from 'src/lib/hooks/useDebounce';
import { validateNumber } from '../../util/durationFilterUtil';

export interface MinMax {
    min?: number;
    max?: number;
}

export interface MinMaxInputProps {
    value: MinMax | null;
    onChange(value: MinMax | null): void;
    allowNegativeInput: boolean;
}

const MinMaxInput: FC<MinMaxInputProps> = ({
    value,
    onChange,
    allowNegativeInput
}) => {
    const [min, setMin] = useState<string>(value && value.min !== undefined ? value.min.toString() : '0');
    const [max, setMax] = useState<string>(value && value.max !== undefined ? value.max.toString() : '');

    const debouncedMin = useDebounce(min, 500);
    const debouncedMax = useDebounce(max, 500);

    useEffect(() => {
        setMin(value && value.min !== undefined ? value.min.toString() : '0');
        setMax(value && value.max !== undefined ? value.max.toString() : '');
    }, [value]);

    const checkValidNumber = (num: number) => validateNumber(num, allowNegativeInput);

    // get the min value based on data validation
    const getMin = (num: any) => {
        if (checkValidNumber(num)) {
            // validate min is less than max
            if (num && max) {
                if (parseFloat(num) < parseFloat(max)) {
                    return num;
                }
            } else {
                // max does not exist, just set the min value
                return num;
            }
        }
        return '';
    };

    const getMax = (num: any) => {
        if (checkValidNumber(num)) {
            // validate min is less than max
            if (num && min) {
                if (parseFloat(num) > parseFloat(min)) {
                    return num;
                }
            } else {
                // min does not exist or is zero, just set the max value
                return num;
            }
        }
        return '';
    };

    useEffect(() => {
        const minValue = getMin(debouncedMin);
        setMin(minValue);
        submitSearch(minValue, max);
    }, [debouncedMin]);

    useEffect(() => {
        const maxValue = getMax(debouncedMax);
        setMax(maxValue);
        submitSearch(min, maxValue);
    }, [debouncedMax]);

    const submitSearch = (min: string, max: string) => {
        if (min || max) {
            const output: MinMax = {};
            if (min) {
                output.min = parseFloat(min);
            }
            if (max) {
                output.max = parseFloat(max);
            }

            onChange(output);
        } else {
            onChange(null);
        }
    };

    return (
        <div>
            <Input
                aria-label="min-input"
                label="Min"
                style={{ width: 'initial' }}
                type="number"
                onChange={e => { setMin(e.target.value); }}
                value={min}
            />

            <Input
                aria-label="max-input"
                label="Max"
                style={{ width: 'initial' }}
                type="number"
                onChange={e => { setMax(e.target.value); }}
                value={max}
            />
        </div>
    );
};

export default MinMaxInput;

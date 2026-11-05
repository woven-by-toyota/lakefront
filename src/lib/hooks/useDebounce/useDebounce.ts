import { useEffect, useState } from 'react';

const useDebounce = <T = any>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(id);
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;

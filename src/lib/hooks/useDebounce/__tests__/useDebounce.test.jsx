import { act, render, renderHook } from '@testing-library/react';
import useDebounce from '../useDebounce';

jest.useFakeTimers();

const TestComponent = ({ value }) => {
    const newValue = useDebounce(value, 150);

    return <div>{newValue}</div>;
};

describe('useDebounce', () => {
    it('should initialize with the provided value', () => {
        const { result } = renderHook(() => useDebounce('a', 150));

        expect(result.current).toBe('a');
    });

    it('should return first provided value if delay has not been exceeded', () => {
        const { queryByText, rerender } = render(<TestComponent value='a' />);

        // renders with initial value correctly.
        expect(queryByText('a')).toBeInTheDocument();
        expect(queryByText('b')).not.toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(100);
        });

        rerender(<TestComponent value='b' />);

        //  still renders with initial value since
        // delay has not been exceeded
        expect(queryByText('a')).toBeInTheDocument();
        expect(queryByText('b')).not.toBeInTheDocument();
    });

    it('should return new provided value once delay is exceeded', () => {
        const { queryByText, rerender } = render(<TestComponent value='a' />);

        // renders with initial value correctly.
        expect(queryByText('a')).toBeInTheDocument();
        expect(queryByText('b')).not.toBeInTheDocument();

        rerender(<TestComponent value='b' />);

        // still renders with initial value due to debounce delay
        expect(queryByText('a')).toBeInTheDocument();
        expect(queryByText('b')).not.toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(150);
        });

        // new value takes effect after delay exceeded
        expect(queryByText('a')).not.toBeInTheDocument();
        expect(queryByText('b')).toBeInTheDocument();
    });
});

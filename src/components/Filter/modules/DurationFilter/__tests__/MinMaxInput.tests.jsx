import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import MinMaxInput from '../MinMaxInput';

describe('<MinMaxInput />', () => {
    it('number entry works', async () => {
        const onChangeCallback = jest.fn();
        render(<MinMaxInput value={{}} onChange={onChangeCallback} allowNegativeInput={false} />);

        const minInput = screen.getByLabelText('min-input');
        fireEvent.change(minInput, { target: { value: '10' } });
        expect(minInput.value).toBe('10');

        const maxInput = screen.getByLabelText('max-input');
        fireEvent.change(maxInput, { target: { value: '16' } });
        expect(maxInput.value).toBe('16');

        // entering a lower number than max works
        fireEvent.change(minInput, { target: { value: '8' } });

        await waitFor(() => expect(onChangeCallback).toHaveBeenCalledTimes(4));
        expect(onChangeCallback.mock.calls[3][0].min).toBe(8);
        expect(onChangeCallback.mock.calls[3][0].max).toBe(16);

        // resetting values works
        fireEvent.change(maxInput, { target: { value: '' } });
        fireEvent.change(minInput, { target: { value: '' } });
        await waitFor(() => expect(onChangeCallback).toHaveBeenCalledTimes(6));
        expect(onChangeCallback.mock.calls[5][0]).toBeNull();

        // negative number does not work
        fireEvent.change(minInput, { target: { value: '-7' } });
        await waitFor(() => expect(onChangeCallback).toHaveBeenCalledTimes(7));
        expect(onChangeCallback.mock.calls[6][0]).toBeNull();
    });

    it('number checking works', async () => {
        const onChangeCallback = jest.fn();
        render(<MinMaxInput value={{ min: 10, max: 20 }} onChange={onChangeCallback} allowNegativeInput={true} />);

        const minInput = screen.getByLabelText('min-input');

        // entering a non number will not work
        fireEvent.change(minInput, { target: { value: 'abc' } });
        expect(minInput.value).toBe('');

        // forcing a higher min number will not work
        fireEvent.change(minInput, { target: { value: '25' } });
        await waitFor(() => expect(onChangeCallback).toHaveBeenCalledTimes(2));
        expect(onChangeCallback.mock.calls[1][0].min).toBe(10);

        // reset min to 10
        fireEvent.change(minInput, { target: { value: '10' } });

        // forcing a lower max number will not work
        const maxInput = screen.getByLabelText('max-input');
        fireEvent.change(maxInput, { target: { value: '5' } });
        await waitFor(() => expect(onChangeCallback).toHaveBeenCalledTimes(3));
        expect(onChangeCallback.mock.calls[2][0].max).toBeUndefined();
    });
});

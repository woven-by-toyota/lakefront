import React from 'react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme as render } from 'src/lib/testing';
import TextSearch from '../TextSearch';

/**
 * Mimic user type/submit event
 */
const typeAndSubmit = async (input, text) => {
    const user = userEvent.setup();

    await user.type(input, text);
    // tabbing away blurs the input, which is what submits the search
    await user.tab();
};

describe('<TextSearch />', () => {
    it('renders input text', () => {
        const { getByRole } = render(<TextSearch />);

        getByRole('textbox');
    });

    it('onChange callback does not fire on input change', () => {
        const changeCallback = jest.fn();
        const { getByRole } = render(<TextSearch onChange={changeCallback} />);
        fireEvent.change(getByRole('textbox'), { target: { value: 'asdf' } });
        expect(changeCallback).not.toHaveBeenCalled();
    });

    it('onChange callback fires on blur change', () => {
        const changeCallback = jest.fn();
        const { getByRole } = render(<TextSearch onChange={changeCallback} />);
        fireEvent.blur(getByRole('textbox'), { target: { value: 'asdf' } });
        expect(changeCallback).toHaveBeenCalledWith('asdf');
    });

    it('onChange callback fires on enter key press', () => {
        const changeCallback = jest.fn();
        const { getByRole } = render(<TextSearch onChange={changeCallback} />);
        fireEvent.keyPress(getByRole('textbox'), { key: 'Enter', charCode: 13, target: { value: 'asdf' } });
        expect(changeCallback).toHaveBeenCalledWith('asdf');
    });

    it('trims leading and trailing whitespace on submit', async () => {
        const changeCallback = jest.fn();
        const { getByRole } = render(<TextSearch onChange={changeCallback} value='' />);
        const input = getByRole('textbox');

        await typeAndSubmit(input, '  asdf  ');

        expect(changeCallback).toHaveBeenCalledWith('asdf');
        expect(input).toHaveValue('asdf');
    });

    it('clears the input when only whitespace is submitted', async () => {
        const changeCallback = jest.fn();
        const { getByRole } = render(<TextSearch onChange={changeCallback} value='' />);
        const input = getByRole('textbox');

        await typeAndSubmit(input, '   ');

        expect(changeCallback).toHaveBeenCalledWith('');
        expect(input).toHaveValue('');
    });

    it('does not trim whitespace between words', async () => {
        const changeCallback = jest.fn();
        const { getByRole } = render(<TextSearch onChange={changeCallback} value='' />);
        const input = getByRole('textbox');

        await typeAndSubmit(input, ' first  last ');

        expect(changeCallback).toHaveBeenCalledWith('first  last');
        expect(input).toHaveValue('first  last');
    });

    it('keeps whitespace when trimWhitespace is false', async () => {
        const changeCallback = jest.fn();
        const { getByRole } = render(<TextSearch onChange={changeCallback} value='' trimWhitespace={false} />);
        const input = getByRole('textbox');

        await typeAndSubmit(input, '  asdf  ');

        expect(changeCallback).toHaveBeenCalledWith('  asdf  ');
        expect(input).toHaveValue('  asdf  ');
    });

    it('only accepts numbers when specified', () => {
        const changeCallback = jest.fn();
        const { getByRole } = render(<TextSearch onChange={changeCallback} type='number' />);
        fireEvent.keyPress(getByRole('spinbutton'), { key: 'Enter', charCode: 13, target: { value: 'asdf' } });
        expect(changeCallback).toHaveBeenCalledWith('');
        fireEvent.keyPress(getByRole('spinbutton'), { key: 'Enter', charCode: 13, target: { value: '1' } });
        expect(changeCallback).toHaveBeenCalledWith('1');
    });
});

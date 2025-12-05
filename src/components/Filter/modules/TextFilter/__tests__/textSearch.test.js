import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import TextSearch from '../TextSearch';

describe('<TextSearch />', () => {
    it('renders input text', () => {
        const { getByRole } = render(<TextSearch />);

        getByRole('textbox');
    });

    it('onChange callback does not fire on input change', () => {
        const changeCallback = jest.fn();
        const { getByRole } = render(<TextSearch onChange={changeCallback} />);
        fireEvent.change(getByRole('textbox'), { target: { value: 'asdf' } });
        expect(changeCallback).not.toBeCalled();
    });

    it('onChange callback fires on blur change', () => {
        const changeCallback = jest.fn();
        const { getByRole } = render(<TextSearch onChange={changeCallback} />);
        fireEvent.blur(getByRole('textbox'), { target: { value: 'asdf' } });
        expect(changeCallback).toBeCalledWith('asdf');
    });

    it('onChange callback fires on enter key press', () => {
        const changeCallback = jest.fn();
        const { getByRole } = render(<TextSearch onChange={changeCallback} />);
        fireEvent.keyPress(getByRole('textbox'), { key: 'Enter', charCode: 13, target: { value: 'asdf' } });
        expect(changeCallback).toBeCalledWith('asdf');
    });

    it('only accepts numbers when specified', () => {
        const changeCallback = jest.fn();
        const { getByRole } = render(<TextSearch onChange={changeCallback} type='number' />);
        fireEvent.keyPress(getByRole('spinbutton'), { key: 'Enter', charCode: 13, target: { value: 'asdf' } });
        expect(changeCallback).toBeCalledWith('');
        fireEvent.keyPress(getByRole('spinbutton'), { key: 'Enter', charCode: 13, target: { value: '1' } });
        expect(changeCallback).toBeCalledWith('1');
    });
});

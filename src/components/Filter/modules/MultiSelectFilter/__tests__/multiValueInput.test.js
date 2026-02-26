import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import MultiValueInput from '../MultiValueInput';

describe('MultiValueInput', () => {
    it('renders correctly', () => {
        const { getByRole } = render(
            <MultiValueInput handleCreate={() => null} />
        );

        getByRole('textbox');
    });

    it('receives focus on render', () => {
        const { getByRole } = render(
            <MultiValueInput handleCreate={() => null} />
        );

        expect(getByRole('textbox')).toHaveFocus();
    });

    it('calls handleCreate on paste with correct data', () => {
        const handleCreate = jest.fn();
        const pasteData = 'a';
        const { getByRole } = render(
            <MultiValueInput handleCreate={handleCreate} />
        );

        fireEvent.paste(getByRole('textbox'), {
            clipboardData: { getData: () => pasteData }
        });

        expect(handleCreate).toHaveBeenCalledWith(pasteData);
    });
});

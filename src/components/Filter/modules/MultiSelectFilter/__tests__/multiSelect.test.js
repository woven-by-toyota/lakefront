import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import MultiSelect from '../MultiSelect';

export const MULTI_SELECT_FILTER_OPTIONS = [
    {
        label: 'colors',
        value: 'colors'
    },
    {
        label: 'sizes',
        value: 'sizes'
    },
    {
        label: 'shapes',
        value: 'shapes'
    }
];

const NAME = 'name';

describe('MultiSelect', () => {
    it('renders with the correct defaults', () => {
        const { getByRole, getByText } = render(
            <MultiSelect
                key={NAME}
                title={NAME}
                handleCreateItem={() => null}
                items={MULTI_SELECT_FILTER_OPTIONS}
                value={[]}
                selectItem={() => null}
            />
        );

        fireEvent.mouseDown(getByRole('combobox'));

        for (const option of MULTI_SELECT_FILTER_OPTIONS) {
            getByText(option.label);
        }
    });

    it('allows user to create new options when creatable is true', () => {
        const newOption = 'newOption';
        const { getByRole, queryByText } = render(
            <MultiSelect
                key={NAME}
                title={NAME}
                handleCreateItem={() => null}
                items={MULTI_SELECT_FILTER_OPTIONS}
                value={[]}
                selectItem={() => null}
                creatable
            />
        );

        fireEvent.mouseDown(getByRole('combobox'));
        expect(queryByText(newOption)).not.toBeInTheDocument();

        fireEvent.change(getByRole('combobox'), { target: { value: newOption } });
        fireEvent.keyDown(getByRole('combobox'), { key: 'Enter', code: 'Enter' });
        // Make sure to clear input text
        fireEvent.change(getByRole('combobox'), { target: { value: '' } });
        fireEvent.mouseDown(getByRole('combobox'));

        expect(queryByText('option Create "newOption", selected.'));
    });

    it('prevents user from creating new options when creatable is falsy', () => {
        const newOption = 'newOption';
        const { getByRole, queryByText } = render(
            <MultiSelect
                key={NAME}
                title={NAME}
                handleCreateItem={() => null}
                items={MULTI_SELECT_FILTER_OPTIONS}
                value={[]}
                selectItem={() => null}
            />
        );

        fireEvent.mouseDown(getByRole('combobox'));
        expect(queryByText(newOption)).not.toBeInTheDocument();

        fireEvent.change(getByRole('combobox'), { target: { value: newOption } });
        fireEvent.keyDown(getByRole('combobox'), { key: 'Enter', code: 'Enter' });
        // Make sure to clear input text
        fireEvent.change(getByRole('combobox'), { target: { value: '' } });
        fireEvent.mouseDown(getByRole('combobox'));

        expect(queryByText(newOption)).not.toBeInTheDocument();
    });

    it('calls the handleCreateItem callback when provided', () => {
        const handleCreateItem = jest.fn();
        const { getByRole } = render(
            <MultiSelect
                key={NAME}
                title={NAME}
                handleCreateItem={handleCreateItem}
                items={MULTI_SELECT_FILTER_OPTIONS}
                value={[]}
                selectItem={() => null}
                creatable
            />
        );

        fireEvent.change(getByRole('combobox'), { target: { value: 'text' } });
        fireEvent.keyDown(getByRole('combobox'), { key: 'Enter', code: 'Enter' });

        expect(handleCreateItem).toHaveBeenCalled();
    });

    it('calls the selectItem callback when provided with correct value', () => {
        const selectItem = jest.fn();
        const { getByRole } = render(
            <MultiSelect
                key={NAME}
                title={NAME}
                handleCreateItem={() => null}
                items={MULTI_SELECT_FILTER_OPTIONS}
                value={[]}
                selectItem={selectItem}
                creatable
            />
        );

        fireEvent.change(getByRole('combobox'), { target: { value: 'text' } });
        fireEvent.keyDown(getByRole('combobox'), { key: 'Enter', code: 'Enter' });

        expect(selectItem).toHaveBeenCalledWith(['text']);
    });

    it('renders with no menu when creatable and disableMenu are true', () => {
        const selectItem = jest.fn();
        const { getByRole, queryByText } = render(
            <MultiSelect
                key={NAME}
                title={NAME}
                handleCreateItem={() => null}
                items={MULTI_SELECT_FILTER_OPTIONS}
                value={[]}
                selectItem={selectItem}
                creatable
                disableMenu
            />
        );

        fireEvent.mouseDown(getByRole('combobox'));

        for (const option of MULTI_SELECT_FILTER_OPTIONS) {
            queryByText(option.label);
        }
    });

    it('renders textarea when delimiter is provided', () => {
        const commonProps = {
            key: NAME,
            title: NAME,
            handleCreateItem: () => null,
            items: MULTI_SELECT_FILTER_OPTIONS,
            value: [],
            creatable: true,
            disableMenu: true
        };

        const { container, rerender } = render(<MultiSelect {...commonProps} />);

        expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
        expect(container.querySelector('textarea')).not.toBeInTheDocument();

        rerender(<MultiSelect {...commonProps} delimiter="\n" />);

        expect(container.querySelector('input[type="text"]')).not.toBeInTheDocument();
        expect(container.querySelector('textarea')).toBeInTheDocument();
    });
});

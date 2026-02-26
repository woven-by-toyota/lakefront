import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import DoubleMultiSelect from '../DoubleMultiSelect';

describe('DoubleMultiSelect', () => {
    let onChange = jest.fn();
    const defaultValues = {
        firstSelect: [],
        secondSelect: []
    };

    const defaultOptions = {
        firstSelect: {
            apiField: 'first',
            label: 'First Filter',
            name: 'first',
            creatable: true,
            items: [],
            placeholder: 'Type or paste',
            disableMenu: true,
            barLabel: 'First Filter'
        },
        secondSelect: {
            apiField: 'second',
            label: 'Second Filter',
            name: 'second',
            creatable: true,
            items: [],
            placeholder: 'Type or paste',
            disableMenu: true,
            barLabel: 'Second Filter'
        }
    };

    beforeEach(jest.resetAllMocks);

    it('should render with no provided values', () => {
        const { container } = render(
            <DoubleMultiSelect value={defaultValues} onChange={onChange} options={defaultOptions} />
        );

        expect(container.querySelector('input[name="first"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="second"]')).toBeInTheDocument();
    });

    it('should render with provided values', () => {
        const values = {
            firstSelect: ['a', 'b'],
            secondSelect: ['c', 'd']
        };

        const { getByText } = render(
            <DoubleMultiSelect value={values} onChange={onChange} options={defaultOptions} />
        );

        getByText('a');
        getByText('b');
        getByText('c');
        getByText('d');
    });

    it('should add a value to each multi select', () => {
        const { container } = render(
            <DoubleMultiSelect value={defaultValues} onChange={onChange} options={defaultOptions} />
        );

        const [wrapper] = container.querySelectorAll('div');
        const [firstSelect] = container.querySelectorAll('input');
        const [,,secondSelect] = container.querySelectorAll('input');

        fireEvent.mouseDown(wrapper);

        fireEvent.change(firstSelect, { target: { value: 'a' } });
        fireEvent.keyDown(wrapper, { key: 'Enter', code: 'Enter' });
        fireEvent.mouseDown(wrapper);

        fireEvent.change(secondSelect, { target: { value: 'b' } });
        fireEvent.keyDown(wrapper, { key: 'Enter', code: 'Enter' });
        expect(firstSelect['value']).toBe('a');
        expect(secondSelect['value']).toBe('b');
    });
});
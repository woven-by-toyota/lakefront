import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import SelectPopover from '../SelectPopover';
import Button from 'src/components/Button/Button';

const options = [
    {
        name: 'Option 1',
        value: 'Value 1'
    },
    {
        name: 'Option 2',
        value: 'Value 2'
    },
    {
        name: 'Option 3',
        value: 'Value 3',
        disabled: true
    }
];

describe('SelectPopover', () => {
    let handleClick;
    beforeEach(() => {
        handleClick = jest.fn();
    });

    it('should render when visible is true', () => {
        const { getByText } = render(
            <SelectPopover
                options={options}
                handleClick={handleClick}
                visible={true}
            >
                <Button icon />
            </SelectPopover>
        );

        expect(getByText(options[0].name)).toBeInTheDocument();
    });

    it('should not render when visible is false', () => {
        render(
            <SelectPopover
                options={options}
                handleClick={handleClick}
                visible={false}
            >
                <Button icon />
            </SelectPopover>
        );

        expect(screen.queryByText(options[0].name)).toBeNull();
    });

    it('should call handleClick on click', () => {
        const { getByText } = render(
            <SelectPopover
                options={options}
                handleClick={handleClick}
                visible={true}
            >
                <Button icon />
            </SelectPopover>
        );

        const item = getByText(options[0].name);
        fireEvent.click(item);

        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith(options[0].value);
    });

    it('should not call handleClick on click of disabled item', () => {
        const { getByText } = render(
            <SelectPopover
                options={options}
                handleClick={handleClick}
                visible={true}
            >
                <Button icon />
            </SelectPopover>
        );

        const item1 = getByText(options[0].name);
        const item2 = getByText(options[2].name);
        
        fireEvent.click(item1);
        fireEvent.click(item2);

        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith(options[0].value);
        expect(handleClick).not.toHaveBeenCalledWith(options[2].value);
    });
});

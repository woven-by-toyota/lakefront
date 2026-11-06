import { fireEvent, render } from '@testing-library/react';
import type { ReactNode } from 'react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@emotion/react';
import theme from '../../../styles/theme';
import ContextMenu, { type MenuItem } from '../ContextMenu';

jest.mock('src/lib/hooks/usePopover', () => ({
    __esModule: true,
    default: () => ({ portal: null }),
    PopoverContent: ({ children }: { children: ReactNode }) => <>{children}</>
}));

describe('ContextMenu', () => {
    // held as named mocks rather than read back off the array, which cannot be narrowed past MenuItem
    const onEdit = jest.fn();
    const onCopy = jest.fn();
    const onDelete = jest.fn();

    const mockMenuItems: MenuItem[] = [
        { key: 'edit', label: 'Edit', onClick: onEdit },
        { key: 'copy', label: 'Copy', onClick: onCopy },
        { isSeparator: true },
        { key: 'delete', label: 'Delete', onClick: onDelete, disabled: true }
    ];

    const TestComponent = () => (
        <ThemeProvider theme={theme}>
            <ContextMenu menuItems={mockMenuItems}>
                <div data-testid='trigger-element'>Right-click me</div>
            </ContextMenu>
        </ThemeProvider>
    );

    beforeEach(() => {
        [onEdit, onCopy, onDelete].forEach((onClick) => onClick.mockClear());
    });

    test('renders children and does not show the menu by default', () => {
        const { getByTestId, queryByText } = render(<TestComponent />);

        expect(getByTestId('trigger-element')).toBeInTheDocument();

        expect(queryByText('Edit')).not.toBeInTheDocument();
        expect(queryByText('Copy')).not.toBeInTheDocument();
    });

    test('shows the menu with correct items on right-click', () => {
        const { getByText, getByTestId } = render(<TestComponent />);
        const trigger = getByTestId('trigger-element');

        fireEvent.contextMenu(trigger);

        expect(getByText('Edit')).toBeInTheDocument();
        expect(getByText('Copy')).toBeInTheDocument();
        expect(getByText('Delete')).toBeInTheDocument();
    });

    test('calls the correct onClick handler when a menu item is clicked and then closes the menu', () => {
        const { getByTestId, getByText, queryByText } = render(<TestComponent />);
        const trigger = getByTestId('trigger-element');

        fireEvent.contextMenu(trigger);

        const copyButton = getByText('Copy');
        fireEvent.click(copyButton);

        expect(onCopy).toHaveBeenCalledTimes(1);
        expect(onEdit).not.toHaveBeenCalled();

        expect(queryByText('Copy')).not.toBeInTheDocument();
    });

    test('does not call onClick for a disabled menu item', () => {
        const { getByTestId, getByText } = render(<TestComponent />);
        const trigger = getByTestId('trigger-element');

        fireEvent.contextMenu(trigger);

        const deleteButton = getByText('Delete');
        fireEvent.click(deleteButton);

        expect(onDelete).not.toHaveBeenCalled();

        expect(getByText('Delete')).toBeInTheDocument();
    });

    test('closes the menu when clicking outside', () => {
        const { getByTestId, getByText, queryByText } = render(
            <div>
                <div data-testid='outside-element'>Outside</div>
                <TestComponent />
            </div>
        );
        const trigger = getByTestId('trigger-element');

        fireEvent.contextMenu(trigger);
        expect(getByText('Edit')).toBeInTheDocument();

        const outsideElement = getByTestId('outside-element');
        fireEvent.mouseDown(outsideElement);

        expect(queryByText('Edit')).not.toBeInTheDocument();
    });
});

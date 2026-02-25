import { fireEvent, waitFor } from '@testing-library/react';
import Snackbar from '../index';
import { MESSAGE_TYPES } from '../Snackbar.util';
import { ReactComponent as CloseIcon } from 'src/stories/Snackbar/assets/closeIcon.svg';
import { renderWithTheme } from '../../../lib/testing';

const handleButtonClick = jest.fn();
const button = (
    <button
        alternate="true"
        className="closeIcon"
        key="close"
        aria-label="Close"
        onClick={handleButtonClick}
        icon={<CloseIcon />}
    />
);

const snackbarPropsOpen = {
    action: button,
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    autoHideDuration: 4000,
    message: 'File transfer initiated.',
    onClose: () => {},
    open: true,
    type: MESSAGE_TYPES.SUCCESS,
    renderInPortal: false
};

const snackbarPropsClosed = {
...snackbarPropsOpen,
    open: false,
};

jest.useFakeTimers();

describe('<Snackbar>', () => {
    it('should render component when open is true', () => {
        const { container } = renderWithTheme(
                <Snackbar {...snackbarPropsOpen} />
        );
        expect(container).toBeDefined();
    });

    it('should not render snackbar when open is false', () => {
        const { container } = renderWithTheme(<Snackbar {...snackbarPropsClosed} />);
        expect(container.getElementsByClassName('snackbarOpen').length).toBe(0);
    });

    it('should render props with classNames when open is true', () => {
        const { getByText, container } = renderWithTheme(<Snackbar {...snackbarPropsOpen} />);

        expect(container.querySelector('svg')).toBeInTheDocument();
        expect(container.getElementsByClassName('snackbarContent').length).toBe(1);
        expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);
        expect(container.getElementsByClassName('closeIcon').length).toBe(1);
        expect(container.getElementsByClassName('snackbarMessage').length).toBe(1);
        getByText('File transfer initiated.');
        expect(container.getElementsByClassName('snackbarIcon').length).toBe(1);
        expect(container.querySelector('svg')).toContainHTML('<svg style="fill: #378fee;" />');
        expect(container.querySelector('button')).toBeEnabled();
        expect(container.querySelectorAll('div')).toHaveLength(5);
    });

    it('should render snackbar portal onClick of button', async () => {
        const { container, getByRole, rerender } = renderWithTheme(<Snackbar {...snackbarPropsClosed} />);
        // open = false
        expect(container.querySelector('button')).not.toBeInTheDocument();

        rerender(<Snackbar {...snackbarPropsOpen} />);
        fireEvent.click(getByRole('button'));

        expect(handleButtonClick).toHaveBeenCalled();

        await waitFor(() => {
            expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);
        });
    });

    it('sets snackbarClosed after autoHideDuration (4000ms)', () => {
        const { container } = renderWithTheme(<Snackbar {...snackbarPropsOpen} />);

        expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);
        expect(container.getElementsByClassName('snackbarClosed').length).toBe(0);

        jest.advanceTimersByTime(4000);
        expect(container.getElementsByClassName('snackbarClosed').length).toBe(1);
    });

    it('checks onClose has been called after autoHideDuration (4000ms)', () => {
        const onCloseMock = jest.fn();
        renderWithTheme(<Snackbar {...snackbarPropsOpen} onClose={onCloseMock} />);

        jest.advanceTimersByTime(4000);
        expect(onCloseMock).toHaveBeenCalledWith('timeout');
    });

    it('has autoHideDuration as null and won\'t close on timer', () => {
        const onCloseMock = jest.fn();
        const { container } = renderWithTheme(<Snackbar {...snackbarPropsOpen} autoHideDuration={null} onClose={onCloseMock} />);

        expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);

        jest.advanceTimersByTime(4000);
        // snackbarOpen didn't close as expected
        expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);
    });

    it('has autoHideDuration as undefined and will default timeout in 4000ms', () => {
        const onCloseMock = jest.fn();
        const { container } = renderWithTheme(
            <Snackbar {...snackbarPropsOpen} autoHideDuration={undefined} onClose={onCloseMock} />
        );

        expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);

        jest.advanceTimersByTime(4000);
        expect(container.getElementsByClassName('snackbarClosed').length).toBe(1);
    });

    it('overwrites autoHideDuration default value 4000ms', () => {
        const onCloseMock = jest.fn();
        const { container } = renderWithTheme(<Snackbar {...snackbarPropsOpen} autoHideDuration={2000} onClose={onCloseMock} />);

        expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);

        jest.advanceTimersByTime(2000);
        expect(onCloseMock).toHaveBeenCalledWith('timeout');
    });

    it('should check onClose has been called', () => {
        const onCloseMock = jest.fn();
        const actionButton = <button key="close" onClick={onCloseMock} icon={<CloseIcon />} />;

        const { container, getByRole } = renderWithTheme(
            <Snackbar {...snackbarPropsOpen} onClose={onCloseMock} action={actionButton} />
        );

        expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);

        fireEvent.click(getByRole('button'));

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    describe('theme support', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('renders correctly in light theme', () => {
            const { container } = renderWithTheme(<Snackbar {...snackbarPropsOpen} />);
            expect(container).toBeDefined();
            expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);
        });

        it('renders correctly in dark theme', () => {
            const { container } = renderWithTheme(<Snackbar {...snackbarPropsOpen} />, 'dark');
            expect(container).toBeDefined();
            expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);
        });

        it('renders snackbar content consistently across themes', () => {
            const { getByText: lightGetByText, container: lightContainer } = renderWithTheme(
                <Snackbar {...snackbarPropsOpen} />
            );

            const { getByText: darkGetByText, container: darkContainer } = renderWithTheme(
                <Snackbar {...snackbarPropsOpen} />,
                'dark'
            );

            // Both should render the message
            lightGetByText('File transfer initiated.');
            darkGetByText('File transfer initiated.');

            // Both should have the same structure
            expect(lightContainer.getElementsByClassName('snackbarContent').length).toBe(1);
            expect(darkContainer.getElementsByClassName('snackbarContent').length).toBe(1);

            expect(lightContainer.getElementsByClassName('snackbarMessage').length).toBe(1);
            expect(darkContainer.getElementsByClassName('snackbarMessage').length).toBe(1);

            expect(lightContainer.getElementsByClassName('snackbarIcon').length).toBe(1);
            expect(darkContainer.getElementsByClassName('snackbarIcon').length).toBe(1);
        });

        it('handles button interactions consistently across themes', async () => {
            const lightHandleClick = jest.fn();
            const darkHandleClick = jest.fn();

            const lightButton = (
                <button
                    alternate="true"
                    className="closeIcon"
                    key="close"
                    aria-label="Close"
                    onClick={lightHandleClick}
                    icon={<CloseIcon />}
                />
            );

            const darkButton = (
                <button
                    alternate="true"
                    className="closeIcon"
                    key="close"
                    aria-label="Close"
                    onClick={darkHandleClick}
                    icon={<CloseIcon />}
                />
            );

            const { getByRole: lightGetByRole } = renderWithTheme(
                <Snackbar {...snackbarPropsOpen} action={lightButton} />
            );

            const { getByRole: darkGetByRole } = renderWithTheme(
                <Snackbar {...snackbarPropsOpen} action={darkButton} />,
                'dark'
            );

            fireEvent.click(lightGetByRole('button'));
            fireEvent.click(darkGetByRole('button'));

            expect(lightHandleClick).toHaveBeenCalledTimes(1);
            expect(darkHandleClick).toHaveBeenCalledTimes(1);
        });

        it('handles auto-hide functionality consistently across themes', () => {
            const lightOnClose = jest.fn();
            const darkOnClose = jest.fn();

            const { container: lightContainer } = renderWithTheme(
                <Snackbar {...snackbarPropsOpen} onClose={lightOnClose} />
            );

            const { container: darkContainer } = renderWithTheme(
                <Snackbar {...snackbarPropsOpen} onClose={darkOnClose} />,
                'dark'
            );

            // Both should be open initially
            expect(lightContainer.getElementsByClassName('snackbarOpen').length).toBe(1);
            expect(darkContainer.getElementsByClassName('snackbarOpen').length).toBe(1);

            // After timeout, both should close
            jest.advanceTimersByTime(4000);

            expect(lightContainer.getElementsByClassName('snackbarClosed').length).toBe(1);
            expect(darkContainer.getElementsByClassName('snackbarClosed').length).toBe(1);

            expect(lightOnClose).toHaveBeenCalledWith('timeout');
            expect(darkOnClose).toHaveBeenCalledWith('timeout');
        });

        it('handles different message types consistently across themes', () => {
            const successProps = { ...snackbarPropsOpen, type: MESSAGE_TYPES.SUCCESS };
            const errorProps = { ...snackbarPropsOpen, type: MESSAGE_TYPES.ERROR };

            const { container: lightSuccessContainer } = renderWithTheme(<Snackbar {...successProps} />);
            const { container: darkSuccessContainer } = renderWithTheme(<Snackbar {...successProps} />, 'dark');

            const { container: lightErrorContainer } = renderWithTheme(<Snackbar {...errorProps} />);
            const { container: darkErrorContainer } = renderWithTheme(<Snackbar {...errorProps} />, 'dark');

            // All should render with icons
            expect(lightSuccessContainer.getElementsByClassName('snackbarIcon').length).toBe(1);
            expect(darkSuccessContainer.getElementsByClassName('snackbarIcon').length).toBe(1);
            expect(lightErrorContainer.getElementsByClassName('snackbarIcon').length).toBe(1);
            expect(darkErrorContainer.getElementsByClassName('snackbarIcon').length).toBe(1);
        });

        it('handles open/closed states consistently across themes', () => {
            // Test closed state
            const { container: lightClosedContainer } = renderWithTheme(<Snackbar {...snackbarPropsClosed} />);
            const { container: darkClosedContainer } = renderWithTheme(<Snackbar {...snackbarPropsClosed} />, 'dark');

            expect(lightClosedContainer.getElementsByClassName('snackbarOpen').length).toBe(0);
            expect(darkClosedContainer.getElementsByClassName('snackbarOpen').length).toBe(0);

            // Test open state
            const { container: lightOpenContainer } = renderWithTheme(<Snackbar {...snackbarPropsOpen} />);
            const { container: darkOpenContainer } = renderWithTheme(<Snackbar {...snackbarPropsOpen} />, 'dark');

            expect(lightOpenContainer.getElementsByClassName('snackbarOpen').length).toBe(1);
            expect(darkOpenContainer.getElementsByClassName('snackbarOpen').length).toBe(1);
        });
    });
});

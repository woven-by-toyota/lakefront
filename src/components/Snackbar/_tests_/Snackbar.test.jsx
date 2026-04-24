import { fireEvent, waitFor, act } from '@testing-library/react';
import Snackbar from '../index';
import { MESSAGE_TYPES } from '../Snackbar.util';
import { ReactComponent as CloseIcon } from 'src/stories/Snackbar/assets/closeIcon.svg';
import { renderWithTheme as render } from '../../../lib/testing';

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

jest.useFakeTimers('modern');

describe('<Snackbar>', () => {
    it('should render component when open is true', () => {
        const { container } = render(
                <Snackbar {...snackbarPropsOpen} />
        );
        expect(container).toBeDefined();
    });

    it('should not render snackbar when open is false', () => {
        const { container } = render(<Snackbar {...snackbarPropsClosed} />);
        expect(container.getElementsByClassName('snackbarOpen').length).toBe(0);
    });

    it('should render props with classNames when open is true', () => {
        const { getByText, container } = render(<Snackbar {...snackbarPropsOpen} />);

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
        const { container, getByRole, rerender } = render(<Snackbar {...snackbarPropsClosed} />);
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
        const { container } = render(<Snackbar {...snackbarPropsOpen} />);

        expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);
        expect(container.getElementsByClassName('snackbarClosed').length).toBe(0);

        jest.advanceTimersByTime(4000);
        expect(container.getElementsByClassName('snackbarClosed').length).toBe(1);
    });

    it('checks onClose has been called after autoHideDuration (4000ms)', () => {
        const onCloseMock = jest.fn();
        render(<Snackbar {...snackbarPropsOpen} onClose={onCloseMock} />);

        act(() => {
            jest.runAllTimers();
        });
        expect(onCloseMock).toHaveBeenCalledWith('timeout');
    });

    it('has autoHideDuration as null and won\'t close on timer', () => {
        const onCloseMock = jest.fn();
        const { container } = render(<Snackbar {...snackbarPropsOpen} autoHideDuration={null} onClose={onCloseMock} />);

        expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);

        jest.advanceTimersByTime(4000);
        // snackbarOpen didn't close as expected
        expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);
    });

    it('has autoHideDuration as undefined and will default timeout in 4000ms', () => {
        const onCloseMock = jest.fn();
        const { container } = render(
            <Snackbar {...snackbarPropsOpen} autoHideDuration={undefined} onClose={onCloseMock} />
        );

        expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);

        jest.advanceTimersByTime(4000);
        expect(container.getElementsByClassName('snackbarClosed').length).toBe(1);
    });

    it('overwrites autoHideDuration default value 4000ms', () => {
        const onCloseMock = jest.fn();
        const { container } = render(<Snackbar {...snackbarPropsOpen} autoHideDuration={2000} onClose={onCloseMock} />);

        expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);

        act(() => {
            jest.runAllTimers();
        });
        expect(onCloseMock).toHaveBeenCalledWith('timeout');
    });

    it('should check onClose has been called', () => {
        const onCloseMock = jest.fn();
        const actionButton = <button key="close" onClick={onCloseMock} icon={<CloseIcon />} />;

        const { container, getByRole } = render(
            <Snackbar {...snackbarPropsOpen} onClose={onCloseMock} action={actionButton} />
        );

        expect(container.getElementsByClassName('snackbarOpen').length).toBe(1);

        fireEvent.click(getByRole('button'));

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
});

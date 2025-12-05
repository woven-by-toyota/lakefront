import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import CopyButton, { COPY_TEXT } from '../CopyButton';

const originalClipboard = { ...global.navigator.clipboard };

afterEach(() => {
    global.navigator.clipboard = originalClipboard;
});

describe('CopyButton', () => {
    it('renders properly with default text and icon', () => {
        const { container, getByRole, getByText } = render(<CopyButton />);

        getByText(COPY_TEXT);
        getByRole('button');

        expect(container.querySelector('svg[aria-label="File Copy"]')).toBeInTheDocument();
    });

    it('renders with provided custom text', () => {
        const BUTTON_TEXT = 'buttonText';
        const { getByRole, getByText } = render(<CopyButton buttonText={BUTTON_TEXT} />);

        getByText(BUTTON_TEXT);
    });

    it('calls onCopy with correct payload', () => {
        const onCopy = jest.fn();
        const { getByRole } = render(<CopyButton onCopy={onCopy} valueToCopy={COPY_TEXT} />);

        global.navigator.clipboard = {
            writeText: () => null
        };

        fireEvent.click(getByRole('button'));

        expect(onCopy).toHaveBeenCalledWith(COPY_TEXT);
    });

    it('does not call onCopy when copy function fails', () => {
        const onCopy = jest.fn();
        const { getByRole } = render(<CopyButton onCopy={onCopy} valueToCopy={COPY_TEXT} />);

        global.navigator.clipboard = {
            writeText: () => { throw new Error('error') }
        };

        fireEvent.click(getByRole('button'));

        expect(onCopy).not.toHaveBeenCalled();
    });

    it('does not call onCopy when disabled', () => {
        const onCopy = jest.fn();
        const { getByRole } = render(<CopyButton onCopy={onCopy} valueToCopy={COPY_TEXT} disabled />);

        global.navigator.clipboard = {
            writeText: () => null
        };

        fireEvent.click(getByRole('button'));

        expect(onCopy).not.toHaveBeenCalled();;
    });

    it('renders Icon Only', () => {
        const onCopy = jest.fn();
        const { getByText } = render(<CopyButton onCopy={onCopy} valueToCopy={COPY_TEXT} disabled iconOnly={true}/>);
        // throws error as the text doesn't exist in iconOnly mode.
        expect(()=>getByText(COPY_TEXT)).toThrowError();
    });
});

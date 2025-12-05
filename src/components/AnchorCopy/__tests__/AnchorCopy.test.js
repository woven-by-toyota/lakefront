import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import AnchorCopy from '../AnchorCopy';

const originalClipboard = { ...global.navigator.clipboard };

afterEach(() => {
    global.navigator.clipboard = originalClipboard;
});

describe('AnchorCopy', () => {
    const title = 'Title Here';

    it('renders properly', () => {
        const { getByRole, getByText } = render(<AnchorCopy title={title} />);

        getByText(title);
        getByRole('button');
    });

    it('renders with provided anchor content when passed', () => {
        const CONTENT = 'content';
        const { queryByRole, getByText } = render(<AnchorCopy title={title} AnchorContent={() => <div>{CONTENT}</div>} />);

        getByText(CONTENT);
        expect(queryByRole('button')).not.toBeInTheDocument();
    });

    it('calls onCopy with correct payload when provided only title', () => {
        const onCopy = jest.fn();
        const { getByRole } = render(<AnchorCopy title={title} onCopy={onCopy} />);

        global.navigator.clipboard = {
            writeText: () => null
        };

        fireEvent.click(getByRole('button'));

        expect(onCopy).toHaveBeenCalledWith(`http://localhost/#${title.replace(' ', '%20')}`);
    });

    it('calls onCopy with correct payload when provided title and hashId', () => {
        const onCopy = jest.fn();
        const { getByRole } = render(<AnchorCopy title={title} hashId="go-here" onCopy={onCopy} />);

        global.navigator.clipboard = {
            writeText: () => null
        };

        fireEvent.click(getByRole('button'));

        expect(onCopy).toHaveBeenCalledWith('http://localhost/#go-here');
    });

    it('does not call onCopy when copy function fails', () => {
        const onCopy = jest.fn();
        const { getByRole } = render(<AnchorCopy title={title} hashId="go-here" onCopy={onCopy} disabled />);

        global.navigator.clipboard = {
            writeText: () => { throw new Error('error') }
        };

        fireEvent.click(getByRole('button'));

        expect(onCopy).not.toHaveBeenCalled();
    });

    it('does not call onCopy when disabled', () => {
        const onCopy = jest.fn();
        const { getByRole } = render(<AnchorCopy title={title} hashId="go-here" onCopy={onCopy} disabled />);

        global.navigator.clipboard = {
            writeText: () => null
        };

        fireEvent.click(getByRole('button'));

        expect(onCopy).not.toHaveBeenCalled();
    });
});

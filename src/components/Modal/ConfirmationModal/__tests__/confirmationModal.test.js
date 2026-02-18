import { fireEvent } from '@testing-library/react';
import ConfirmationModal from '../ConfirmationModal';
import { renderWithTheme as render } from 'src/lib/testing';

describe('ConfirmationModal', () => {
    it('calls onNo when clicking "no"', () => {
        const onNo = jest.fn();

        const { getByText } = render(<ConfirmationModal modalVisible message={''} onYes={() => null} onNo={onNo} />);

        fireEvent.click(getByText('No'));
        expect(onNo).toHaveBeenCalled();
    });

    it('calls onYes when clicking "yes"', () => {
        const onYes = jest.fn();

        const { getByText } = render(<ConfirmationModal modalVisible message={''} onYes={onYes} onNo={() => null} />);

        fireEvent.click(getByText('Yes'));
        expect(onYes).toHaveBeenCalled();
    });

    it('displays the title and message', () => {
        const { getByText } = render(
            <ConfirmationModal modalVisible message="message" onYes={() => null} onNo={() => null} title="title" />
        );

        getByText('message');
        getByText('title');
    });
});

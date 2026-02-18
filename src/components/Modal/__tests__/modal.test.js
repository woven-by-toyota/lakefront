import React from 'react';
import { fireEvent } from '@testing-library/react';
import Modal, { CANCEL_BUTTON_TEXT } from '../Modal';
import { renderWithTheme as render } from 'src/lib/testing';

const MODAL_PROPS = {
    headerText: 'Small Basic Modal',
    subHeaderText: 'Created with simplicity in mind.',
    isCloseIconVisible: true,
    dialogWidth: 'xs',
    renderInPortal: false
};

describe('Modal', () => {
    describe('rendering modal', () => {
        it('hides modal when isOpen is false', () => {
            const MODAL_TEXT = 'modalText';
            const { queryByText } = render(
                <Modal
                    {...MODAL_PROPS}
                    handleClose={() => null}
                    isOpen={false}
                >
                    <div>{MODAL_TEXT}</div>
                </Modal>
            );

            expect(queryByText(MODAL_TEXT)).not.toBeInTheDocument();
        });

        it('renders correctly', () => {
            const MODAL_TEXT = 'modalText';
            const { queryByText } = render(
                <Modal
                    {...MODAL_PROPS}
                    handleClose={() => null}
                    isOpen
                >
                    <div>{MODAL_TEXT}</div>
                </Modal>
            );

            expect(queryByText(MODAL_TEXT)).toBeInTheDocument();
        });
    });

    describe('rendering child text', () => {
        it('renders no cancel button text when action button undefined', () => {
            const { queryByText } = render(
                <Modal
                    isOpen
                >
                    <div>modalText</div>
                </Modal>
            );

            expect(queryByText(CANCEL_BUTTON_TEXT)).not.toBeInTheDocument();
        });

        it('renders default cancel button text when action button provided', () => {
            const { queryByText } = render(
                <Modal
                    isOpen
                    actionButton={<div>action</div>}
                >
                    <div>modalText</div>
                </Modal>
            );

            expect(queryByText(CANCEL_BUTTON_TEXT)).toBeInTheDocument();
        });

        it('renders with the correct header and subheader text when provided', () => {
            const { queryByText } = render(
                <Modal
                    isOpen
                    {...MODAL_PROPS}
                >
                    <div>modalText</div>
                </Modal>
            );

            expect(queryByText(MODAL_PROPS.headerText)).toBeInTheDocument();
            expect(queryByText(MODAL_PROPS.subHeaderText)).toBeInTheDocument();
        });
    });

    describe('rendering child components', () => {
        it('renders action button', () => {
            const ACTION_BUTTON_TEXT = 'actionButtonText';
            const { queryByText } = render(
                <Modal
                    isOpen
                    actionButton={<div>{ACTION_BUTTON_TEXT}</div>}
                >
                    <div>modalText</div>
                </Modal>
            );

            expect(queryByText(ACTION_BUTTON_TEXT)).toBeInTheDocument();
        });

        it('hides dividers by default', () => {
            const { container } = render(
                <Modal
                    isOpen
                >
                    <div>modalText</div>
                </Modal>
            );

            expect(container.querySelectorAll('div.dialogDivider')).toHaveLength(0);
        });

        it('renders dividers when requested', () => {
            const { container } = render(
                <Modal
                    isOpen
                    showTopDivider
                    showBottomDivider
                >
                    <div>modalText</div>
                </Modal>
            );

            expect(container.querySelectorAll('div.dialogDivider')).toHaveLength(2);
        });

        it('displays close icon by default', () => {
            const { container } = render(
                <Modal
                    isOpen
                >
                    <div>modalText</div>
                </Modal>
            );

            expect(container.querySelector('button[aria-label="Close"]')).toBeInTheDocument();
        });

        it('hides close icon when isCloseIconVisible is false', () => {
            const { container } = render(
                <Modal
                    isOpen
                    isCloseIconVisible={false}
                >
                    <div>modalText</div>
                </Modal>
            );

            expect(container.querySelector('button[aria-label="Close"]')).not.toBeInTheDocument();
        });
    });

    describe('modal functionality', () => {
        it('calls handleClose when close icon is clicked', () => {
            const handleClose = jest.fn();
            const { container } = render(
                <Modal
                    isOpen
                    handleClose={handleClose}
                >
                    <div>modalText</div>
                </Modal>
            );

            fireEvent.click(container.querySelector('button[aria-label="Close"]'));

            expect(handleClose).toHaveBeenCalled();
        });

        it('calls handleClose when close button is clicked', () => {
            const handleClose = jest.fn();
            const { getByText } = render(
                <Modal
                    isOpen
                    handleClose={handleClose}
                    actionButton={<div>action</div>}
                >
                    <div>modalText</div>
                </Modal>
            );

            fireEvent.click(getByText(CANCEL_BUTTON_TEXT));

            expect(handleClose).toHaveBeenCalled();
        });

        it('calls handleClose when dialog container is clicked', () => {
            const handleClose = jest.fn();
            const { container } = render(
                <Modal
                    isOpen
                    handleClose={handleClose}
                    className='dialogContainer'
                >
                    <div>modalText</div>
                </Modal>
            );

            fireEvent.click(container.querySelector('div.dialogContainer'));

            expect(handleClose).toHaveBeenCalled();
        });

        it('does not call handleClose when dialog is clicked', () => {
            const handleClose = jest.fn();
            const { container } = render(
                <Modal
                    isOpen
                    handleClose={handleClose}
                    className='dialogContainer'
                >
                    <div>modalText</div>
                </Modal>
            );

            fireEvent.click(container.querySelector('div.dialogContainer').firstChild);

            expect(handleClose).not.toHaveBeenCalled();
        });

        it('calls mockHandleBackdropClick when the user clicks outside the modal', () => {
            const handleClose = jest.fn();
            const mockHandleBackdropClick = jest.fn();

            const { container } = render(
                <Modal
                    isOpen
                    handleClose={handleClose}
                    handleBackdropClick={mockHandleBackdropClick}
                    className='dialogContainer'
                >
                    <div>modalText</div>
                </Modal>
            );

            fireEvent.click(container.querySelector('div.dialogContainer'));

            expect(mockHandleBackdropClick).toHaveBeenCalled();
            expect(handleClose).not.toHaveBeenCalled();
        });

        it('calls handleClose when close icon is clicked', () => {
            const handleClose = jest.fn();
            const mockHandleBackdropClick = jest.fn();

            const { container } = render(
                <Modal
                    isOpen
                    handleClose={handleClose}
                    handleBackdropClick={mockHandleBackdropClick}
                    className='dialogContainer'
                >
                    <div>modalText</div>
                </Modal>
            );

            fireEvent.click(container.querySelector('button[aria-label="Close"]'));

            expect(mockHandleBackdropClick).not.toHaveBeenCalled();
            expect(handleClose).toHaveBeenCalled();
        });
    });
});

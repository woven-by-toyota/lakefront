import type { FC } from 'react';
import type { FilterJSONConfirmationModalProps } from 'src/components/Filter/types';
import Button from 'src/components/Button/Button';
import { ButtonWrapper, ModalContainer, ModalContent } from './filterJSONConfirmationModalStyles';

const FilterJSONConfirmationModal: FC<FilterJSONConfirmationModalProps> = ({
    modalVisible,
    handleModalClose,
    onConfirm
}) => {
    const handleConfirmation = () => {
        onConfirm();
        handleModalClose();
    };

    return (
        <ModalContainer modalVisible={modalVisible}>
            <ModalContent>
                <p>You have made changes to the JSON filter input, but have not yet applied these updates.</p>
                <p>Would you like to discard your changes and switch back to the Filter UI view?</p>
                <ButtonWrapper>
                    <Button color="secondary" onClick={handleModalClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmation}>Switch to Filter UI</Button>
                </ButtonWrapper>
            </ModalContent>
        </ModalContainer>
    );
};

export default FilterJSONConfirmationModal;

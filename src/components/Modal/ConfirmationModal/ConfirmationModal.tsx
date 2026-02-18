import { FC, ReactElement } from 'react';
import Modal from 'src/components/Modal/Modal';
import { ReactComponent as ErrorIcon } from './assets/errorIcon.svg';
import Button from 'src/components/Button/Button';
import {
  ConfirmationContentSpan,
  ConfirmationDiv,
  ConfirmationTitle,
  ConfirmationTitleDiv
} from './confirmationModalStyles';

export interface ConfirmationModalProps {
  /**
   * The boolean value to determine if the modal is visible or not.
   */
  modalVisible: boolean;
  /**
   * The title of the modal.
   */
  title?: string;
  /**
   * The text or content to display in the main body of the modal.
   */
  message: string | ReactElement;
  /**
   * The yes/accept button text. This defaults to `Yes`.
   */
  yes?: string;
  /**
   * The no/decline button text. This defaults to `No`.
   */
  no?: string;
  /**
   * The action to run when yes/accept action is triggered.
   */
  onYes: () => void;
  /**
   * The action to run when no/decline action is triggered.
   */
  onNo: () => void;
  /**
   * The classes to pass to the modal.
   */
  className?: string;
  /**
   * When true, the component will mount a div to the body and render the dialog through it.
   * This is useful when the dialog would be inside a scrollable container or one with "overflow: hidden"
   * so it doesn't get cut off. Uses IntersectionObserver and needs a polyfill if IE compatibility is needed. This
   * defaults to `false`.
   */
  renderInPortal?: boolean;
}

/**
 * Confirmation Modal Component
 *
 * The Confirmation modal component is a UI blocking dialog meant to handle yes/no responses.
 * The state is not managed inside this component and visibility (via the `modalVisible` prop) needs to be maintained in the parent component.
 * While the default rendering behavior is often sufficient, the `renderInPortal` prop can be used
 * to append a div to the body.
 *
 */
const ConfirmationModal: FC<ConfirmationModalProps> = ({
  modalVisible,
  title,
  message,
  yes = 'Yes',
  no = 'No',
  onYes,
  onNo,
  className,
  renderInPortal
}) => {
  const yesButton = (
    <Button onClick={onYes} color="destructive">
      {yes}
    </Button>
  );

  return (
    <Modal
      isOpen={modalVisible}
      handleClose={onNo}
      actionButton={yesButton}
      cancelButtonText={no}
      className={className}
      renderInPortal={renderInPortal}
    >
      <ConfirmationTitleDiv className='confirmation-title'>
        <ErrorIcon className='error-icon'/>
        {title ? <ConfirmationTitle>{title}</ConfirmationTitle> : ''}
      </ConfirmationTitleDiv>
      <ConfirmationDiv className='confirmation-message'>
        <ConfirmationContentSpan>{message}</ConfirmationContentSpan>
      </ConfirmationDiv>
    </Modal>
  );
};

export default ConfirmationModal;

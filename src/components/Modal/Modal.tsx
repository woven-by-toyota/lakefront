import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ReactComponent as CloseIcon } from './assets/closeIcon.svg';
import Button from 'src/components/Button/Button';
import theme from 'src/styles/theme';
import {
  Dialog, DialogButtonContainer, DialogContainer, DialogContent, DialogDivider, DialogSubHeader, DialogTitleContainer
} from './modalStyles';
import usePopover, { PortalStyles, PopoverContent } from 'src/lib/hooks/usePopover';

export const CANCEL_BUTTON_TEXT = 'Cancel';

export interface ModalProps {
  /**
   * The action to run when close of the modal is triggered
   * (either by the close button, cancel button, or clicking
   * an area outside the modal dialog).
   */
  handleClose?: () => void;
  /**
   * The action to run when backdrop click is triggered
   * by clicking on an area outside the modal dialog.
   */
  handleBackdropClick?: () => void;
  /**
   * The boolean value to determine if the modal is visible or not.
   */
  isOpen: boolean;
  /**
   * The header text to display on the modal.
   * This defaults to an empty string.
   */
  headerText?: string;
  /**
   * The text to display beneath the header text on the modal.
   * This defaults to an empty string.
   */
  subHeaderText?: string;
  /**
   * The boolean value to determine whether the close icon
   * is visible or not. This defaults to `true`.
   */
  isCloseIconVisible?: boolean;
  /**
   * The primary submit/action button on the modal.
   */
  actionButton?: ReactNode;
  /**
   * The cancel button text. This defaults to `Cancel`.
   */
  cancelButtonText?: string;
  /**
   * Any valid React child.
   */
  children?: ReactNode;
  /**
   * The boolean value to determine whether a top divider shows
   * between the header and the dialog main body.
   */
  showTopDivider?: boolean;
  /**
   * The boolean value to determine whether a bottom divider shows
   * between the dialog main body and the action and cancel buttons.
   */
  showBottomDivider?: boolean;
  /**
   * The max-width of the dialog area. This width grows with the size
   * of the screen. Setting to `false` will disable `maxWidth`.
   */
  dialogWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * This is the id to assign to the appended div when rendering in a portal.
   * This defaults to `lakefront-portal-container`.
   */
  portalId?: string;
  /**
   * When true, the component will mount a div to the body and render the dialog through it.
   * This is useful when the dialog would be inside a scrollable container or one with "overflow: hidden"
   * so it doesn't get cut off. Uses IntersectionObserver and needs a polyfill if IE compatibility is needed. This
   * defaults to `false`.
   */
  renderInPortal?: boolean;
  /**
   * The classes to pass to the modal.
   */
  className?: string;
}

/**
 * Modal Component
 *
 * The Modal component is a UI blocking dialog overlay.
 * The state is not managed inside this component and visibility (via the `isOpen` prop) needs to be maintained in the
 * parent component. While the default rendering behavior is often sufficient, the `renderInPortal` prop can be used to
 * append a div to the body.
 *
 */
const Modal: FC<ModalProps> = ({
  handleClose,
  handleBackdropClick = handleClose,
  isOpen,
  headerText = '',
  isCloseIconVisible = true,
  actionButton,
  cancelButtonText = CANCEL_BUTTON_TEXT,
  subHeaderText = '',
  children,
  showTopDivider = false,
  showBottomDivider = false,
  dialogWidth = 'sm',
  portalId,
  renderInPortal = false,
  className
}) => {
  const [dialogElement, setDialogElement] = useState<HTMLElement | null>(null);
  const [bodyOverflow, setBodyOverflow] = useState<string>('');
  const bodyOverflowRef = useRef(false);
  const portalStyles: PortalStyles = useMemo(() => {
    if (dialogElement) {
      return {
        className: dialogElement.className, styles: {
          display: isOpen ? 'flex' : 'none',
          backgroundColor: 'rgb(0,0,0), rgba(0,0,0,0.4)',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: '0',
          left: '0',
          zIndex: `${theme?.zIndex?.modal}`
        }
      };
    }

    return {};
  }, [dialogElement, isOpen]);
  const { portal } = usePopover({
    popoverContainer: dialogElement, portalStyles, portalId, renderInPortal
  });

  useEffect(() => {
    if (portal) {
      portal.onclick = (e) => {
        if (e.target !== portal) {
          return;
        }
        if (handleClose) {
          handleClose();
        }
      };
    }
  }, [portal]);

  useEffect(() => {
    if (document) {
      if (!bodyOverflowRef.current) {
        setBodyOverflow(document.body.style.overflow);
        bodyOverflowRef.current = true;
      }

      isOpen ? document.body.style.overflow = 'hidden' : document.body.style.overflow = bodyOverflow;
      return (() => {
        document.body.style.overflow = bodyOverflow;
      });
    }
  }, [isOpen]);


  const dialogNodeMounted = (node: HTMLDivElement) => {
    setDialogElement(node);
  };

  return (
    <DialogContainer ref={dialogNodeMounted} isOpen={isOpen} className={className}
                     onClick={handleBackdropClick}>
      <PopoverContent
        portal={portal}
        deps={[children, headerText, subHeaderText, isCloseIconVisible, showTopDivider, showBottomDivider, actionButton, cancelButtonText]}
      >
        {isOpen && (<Dialog dialogWidth={dialogWidth} onClick={(e) => e.stopPropagation()}>
          <DialogTitleContainer>
            {headerText}
            {subHeaderText && <DialogSubHeader>{subHeaderText}</DialogSubHeader>}
            {isCloseIconVisible ? (<Button
              className="closeIcon"
              aria-label="Close"
              onClick={handleClose}
              icon={<CloseIcon />}
            />) : (<span />)}
            {showTopDivider && <DialogDivider className="dialogDivider" />}
          </DialogTitleContainer>
          <DialogContent>{children}</DialogContent>
          {showBottomDivider && <DialogDivider className="dialogDivider" />}
          {actionButton && (<DialogButtonContainer>
            <Button color="secondary" onClick={handleClose}>
              {cancelButtonText}
            </Button>
            {actionButton}
          </DialogButtonContainer>)}
        </Dialog>)}
      </PopoverContent>
    </DialogContainer>);
};

export default Modal;

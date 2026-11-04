import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { createDefaultAction, generateAnchorOrigin, MESSAGE_TYPES, SnackbarCloseReason, SnackbarOrigin } from './Snackbar.util';
import SnackbarContent from './SnackbarContent';
import { SnackbarWrapper, TRANSITION_CLOSE_TIME } from './snackbarStyles';
import usePopover, { PopoverContent } from 'src/lib/hooks/usePopover';

export interface SnackbarProps {
    /**
     * The action to display. It renders after the message, at the end of the snackbar.
     */
    action?: ReactNode;
    /**
     * The anchor of the `Snackbar`.
     */
    anchorOrigin?: SnackbarOrigin;
    /**
     * The number of milliseconds to wait before automatically calling the
     * `onClose` function. `onClose` should then set the state of the `open`
     * prop to hide the Snackbar. This behavior is disabled by default with
     * the `null` value. If left undefined will auto hide after 4000ms.
     */
    autoHideDuration?: number | null;
    /**
     * The message to display.
     */
    message?: ReactNode;
    /**
     * Callback fired when the component requests to be closed.
     * Typically `onClose` is used to set state in the parent component,
     * which is used to control the `Snackbar` `open` prop.
     * The `reason` parameter can optionally be used to control the response to `onClose`,
     * for example ignoring `clickaway`.
     *
     * @param {string} reason Can be: `"timeout"` (`autoHideDuration` expired), `"clickaway"`.
     */
    onClose?: (reason: SnackbarCloseReason) => void;
    /**
     * If `true`, `Snackbar` is open.
     */
    open?: boolean;
    /**
     * Message types used to determine icon color and icon to render.
     */
    type: MESSAGE_TYPES;
    /**
     * This is the id to assign to the appended div when rendering in a portal.
     * This defaults to `lakefront-portal-container`.
     */
    portalId?: string;
    /**
     * When true, the component will mount a div to the body and render the popover through it.
     * This is useful when the popover would be inside a scrollable container or one with "overflow: hidden"
     * so it doesn't get cut off. Uses IntersectionObserver and needs a polyfill if IE compatibility is needed.
     */
    renderInPortal?: boolean;
    /**
    * The classes to pass to the snackbar.
    */
    className?: string;
}

/**
 * Snackbar Component
 *
 * The Snackbar component is a UI informational overlay.
 * This can be used to display messages, as well as provide an action with an allocated type that has it's own corresponding icon and styling.
 * The state is not managed inside this component and visibility (via the `open` prop) needs to be maintained in the parent component.
 * The `renderInPortal` prop can be used to append a div to the body.
 *
 */
const Snackbar: FC<SnackbarProps> = ({
    anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
    open,
    autoHideDuration = 4000,
    onClose,
    className,
    message,
    type = MESSAGE_TYPES.INFO,
    portalId,
    renderInPortal = false,
    action = createDefaultAction(() => onClose ? onClose('timeout') : undefined),
}) => {
    const [snackbarWrapperElement, setSnackbarWrapperElement] = useState<HTMLElement | null>(null);
    const snackbarContentRef = useRef<HTMLDivElement | null>(null);
    const { portal, update } = usePopover({
        popoverContainer: snackbarWrapperElement,
        portalId,
        renderInPortal
    });

    useEffect(() => {
        toggleSnackbarOpen();
        let hideDuration = autoHideDuration;
        // allow user to disable autoHideDuration
        if (hideDuration === null) {
            return;
        }
        // allow user to default autoHideDuration to 4000ms
        if (hideDuration === undefined) {
            hideDuration = 4000;
        }
        const timer = setTimeout(() => {
            toggleSnackbarOpen(() => {
                if (onClose) {
                    onClose('timeout');
                }
            });
        }, hideDuration);
        return () => {
            clearTimeout(timer);
        };
    }, [open, autoHideDuration]);

    useEffect(() => {
        if (snackbarWrapperElement && portal) {
            generateAnchorOrigin(anchorOrigin, portal);
            portal.style.padding = '4px 16px';
            portal.className = snackbarWrapperElement.className;
        }
    }, [update, portal]);

    const popoverNodeMounted = (node: HTMLDivElement) => {
        setSnackbarWrapperElement(node);
    };

    const toggleSnackbarOpen = (callback?: () => void) => {
        if (snackbarContentRef.current) {
            const isOpen = snackbarContentRef.current.classList.contains('snackbarOpen');
            const newClass = !isOpen ? 'snackbarOpen' : 'snackbarClosed';

            if (newClass === 'snackbarOpen') {
                snackbarContentRef.current.classList.remove('snackbarClosed');
            }

            if (newClass === 'snackbarClosed') {
                snackbarContentRef.current.classList.remove('snackbarOpen');
            }

            snackbarContentRef.current.className = `${snackbarContentRef.current.className} ${newClass}`;
            if (callback) {
                setTimeout(() => {
                    callback();
                }, TRANSITION_CLOSE_TIME);
            }
        }
    };

    return (
            <SnackbarWrapper className={className} ref={popoverNodeMounted} anchorOrigin={anchorOrigin}>
                <PopoverContent portal={portal} deps={[open]}>
                    {open && (
                        <div className="content-snackbar-wrapper">
                            <SnackbarContent
                                id="snackbar-content"
                                ref={snackbarContentRef}
                                action={action}
                                message={message}
                                type={type}
                            />
                        </div>
                    )}
                </PopoverContent>
            </SnackbarWrapper>
    );
};

export default Snackbar;

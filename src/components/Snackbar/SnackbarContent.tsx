import { ComponentPropsWithRef, FC, forwardRef, ReactNode } from 'react';
import { getIcon, MESSAGE_TYPES } from './Snackbar.util';
import { StyledSnackbarContent, StyledSnackbarMessage, StyledMessageTypeIcons } from './snackbarStyles';
import { useTheme } from '@emotion/react';

export interface SnackbarContentProps {
    /**
     * The action to display. It renders after the message, at the end of the snackbar.
     */
    action?: ReactNode;
    /**
     * The message to display.
     */
    message?: ReactNode;
    /**
     * Message types used to determine icon color and icon to render.
     */
    type: MESSAGE_TYPES;

}

const SnackbarContent: FC<SnackbarContentProps & ComponentPropsWithRef<'div'>> = forwardRef(
    ({ action, message, type,  ...props }, ref) => {
        const theme = useTheme();
        const icon = getIcon(type, theme);

        return (
                <div { ...props}>
                    <StyledSnackbarContent className="snackbarContent" ref={ref}>
                        <StyledSnackbarMessage className="snackbarMessage">{message}</StyledSnackbarMessage>
                        <StyledMessageTypeIcons className="snackbarIcon">{icon}</StyledMessageTypeIcons>
                        {action}
                    </StyledSnackbarContent>
                </div>
        );
    }
);

export default SnackbarContent;

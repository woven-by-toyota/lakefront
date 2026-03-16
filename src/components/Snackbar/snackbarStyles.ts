import styled from '@emotion/styled';
import Button from 'src/components/Button/Button';
import { generateAnchorOrigin, SnackbarOrigin } from './Snackbar.util';
import { lightenDarkenColor } from 'src/styles/stylesUtil';

export const TRANSITION_CLOSE_TIME = 0;

export interface SnackbarPropsStyles {
    anchorOrigin: { horizontal: SnackbarOrigin['horizontal']; vertical: SnackbarOrigin['vertical'] };
}

export const SnackbarWrapper = styled.div<SnackbarPropsStyles>(({ anchorOrigin, theme  }) => {
    const portal = { style: { left: '', bottom: '', right: '', top: '' } };
    // set horizontal properties
    generateAnchorOrigin(anchorOrigin, portal);
    const snackbarStyles = {
        zIndex: theme.zIndex.snackbar,
        position: 'fixed' as const,
        left: portal.style.left || 'auto',
        top: portal.style.top || 'auto',
        right: portal.style.right || 'auto',
        bottom: portal.style.bottom || 'auto'
    };

    return {
        ...snackbarStyles,
        color: theme.foregrounds.widget.secondaryDark,
        '.content-snackbar-wrapper': {
            ...snackbarStyles,
            display: 'flex',
            alignItems: 'center',
            marginTop: 4
        },
        '.snackbarOpen': {
            opacity: 1,
            transform: `scale(${1.02}, ${1.02 ** 2})`,
            transition:
                'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
        },
        '.snackbarClosed': {
            opacity: 0,
            transition:
                'opacity 0ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 130ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            transform: 'none'
        }
    };
});

export const StyledSnackbarCloseButton = styled(Button)(({theme}) => ({
    alignSelf: 'center',
    transform: 'scale(0.8)',
    svg: {
        fill: theme.foregrounds.widget.secondaryDark
    },
    '&:hover': {
      backgroundColor: lightenDarkenColor(theme.backgrounds.widget.secondaryDark, 20),
      svg: {
        fill: theme.foregrounds.widget.secondaryDark
      }
    }
}));

export const StyledSnackbarButton = styled.span(({ theme }) => ({
    display: 'inline-flex',
    backgroundColor: theme.backgrounds.widget.secondaryDark,
    color: theme.foregrounds.widget.secondaryDark,
    borderRadius: 5,
    padding: 5
}));

export const StyledSnackbarContent = styled.div(({theme }) => ({
    display: 'flex',
    alignItems: 'center',
    minWidth: 80,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: `2px solid ${theme.borderColors.primary}`,
    borderRadius: 4,
    backgroundColor: theme.backgrounds.widget.secondaryDark,
    padding: '4px 16px',
    justifyContent: 'space-between',
    color: theme.foregrounds.widget.secondaryDark
}));

export const StyledSnackbarMessage = styled.div(({theme }) => ({
    color: theme.foregrounds.widget.secondaryDark,
    alignSelf: 'center'
}));

export const StyledMessageTypeIcons = styled.span(({ theme }) => ({
    display: 'flex',
    marginLeft: 10,
    position: 'initial',
    color: theme.foregrounds.widget.secondaryDark
}));

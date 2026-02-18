import styled from '@emotion/styled';
import { ModalProps } from './Modal';

const DIALOG_WIDTHS = {
    xs: '20%',
    sm: '30%',
    md: '40%',
    lg: '60%',
    xl: '80%'
};

export const DialogContainer = styled.div<Pick<ModalProps, 'isOpen'>>(({ isOpen, theme }) => ({
    display: isOpen ? 'flex' : 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: theme?.zIndex?.modal
}));

export const Dialog = styled.div<Pick<ModalProps, 'dialogWidth'>>(({ dialogWidth, theme }) => ({
    maxWidth: dialogWidth ? DIALOG_WIDTHS[dialogWidth] : undefined,
    maxHeight: '90%',
    padding: '2em',
    backgroundColor: theme.backgrounds.primary,
    color: theme.foregrounds.primary,
    ...theme.lettering.primary,
    position: 'relative',
    boxShadow: '0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)',
    borderRadius: 4
}));

export const DialogTitleContainer = styled.div(({ theme }) => ({
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: '0.0076em',
    'button.closeIcon': {
        position: 'absolute',
        top: '1em',
        right: '1em',
        svg: {
            fill: theme.foregrounds.secondary
        }
    }
}));

export const DialogSubHeader = styled.div(({ theme }) => ({
    color: theme.foregrounds.secondary,
    fontSize: 16,
    margin: 0,
    padding: 0
}));

export const DialogDivider = styled.div(({ theme }) => ({
    borderBottom: `1px solid ${theme.borderColors.primary}`,
    margin: '1em 0'
}));

export const DialogContent = styled.div<Pick<ModalProps, 'showTopDivider'>>(({ showTopDivider }) => ({
    marginTop: showTopDivider ? 0 : '1em',
    maxHeight: 400,
    overflowY: 'auto'
}));

export const DialogButtonContainer = styled.div({
    display: 'flex',
    justifyContent: 'flex-end',
    'button:first-of-type': {
        marginRight: 2
    },
    'button:last-of-type': {
        marginLeft: 2
    }
});

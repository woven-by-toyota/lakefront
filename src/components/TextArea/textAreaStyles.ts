import styled from '@emotion/styled';
import { TextAreaProps } from './TextArea';

export const StyledLabel = styled.label<TextAreaProps>(({ error, theme }) => ({
    color: theme.foregrounds.primary,
    display: 'flex',
    flexDirection: 'column',
    fontSize: 12,
    fontWeight: 600,
    span: {
        marginBottom: 4,
    },
    div: {
        marginTop: 4,
        minHeight: 14,
    },
    ...(error && {
        color: theme.foregrounds.danger,
    })
}));

export const StyledTextArea = styled.textarea<TextAreaProps>(({ error, theme, disabled }) => ({
    border: `1px solid ${theme.borderColors.secondary}`,
    borderRadius: 4,
    boxSizing: 'border-box',
    backgroundColor: theme.backgrounds.primary,
    color: theme.foregrounds.primary,
    fontSize: 16,
    outline: 'none',
    padding: 12,
    height: 200,
    width: 300,
    ':focus': {
        border: `1px solid ${theme.borderColors.primary}`
    },
    '::placeholder': {
        color: theme.foregrounds.secondary
    },
    cursor: disabled ? 'not-allowed' : undefined,
    ...(error && {
        border: `1px solid ${theme.borderColors.danger}`,
        ':focus': {
            border: `1px solid ${theme.borderColors.danger}`
        },
    })
}));

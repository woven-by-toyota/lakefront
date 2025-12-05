import styled from '@emotion/styled';
import { InputProps } from './Input';

export const INPUT_WIDTH = 300;

export const StyledLabel = styled.label<InputProps>(({ error, theme }) => ({
    color: theme.foregrounds.primary,
    display: 'flex',
    flexDirection: 'column',
    fontSize: 12,
    fontWeight: 600,
    span: {
        marginBottom: 4,
        '&.required-field':{
            color: theme.foregrounds.error,
            marginLeft: 4
        }
    },
    div: {
        marginTop: 4,
        minHeight: 14,
    },
    ...(error && {
        color: theme.foregrounds.error,
    })
}));

export const StyledInput = styled.input<InputProps>(({ error, theme, disabled }) => ({
    border: `1px solid ${theme.borderColors.pronounced}`,
    borderRadius: 4,
    boxSizing: 'border-box',
    backgroundColor: theme.backgrounds.primary,
    color: theme.foregrounds.primary,
    fontSize: 16,
    outline: 'none',
    paddingBottom: 0,
    paddingLeft: 12,
    paddingTop: 0,
    height: 40,
    width: INPUT_WIDTH,
    cursor: disabled ? 'not-allowed' : undefined,
    ':focus': {
        border: `1px solid ${theme.foregrounds.primary}`
    },
    '::placeholder': {
        color: theme.foregrounds.disabled
    },
    ...(error && {
        border: `1px solid ${theme.foregrounds.error}`,
        ':focus': {
            border: `1px solid ${theme.foregrounds.error}`
        },
    })
}));

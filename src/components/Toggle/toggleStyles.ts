import styled from '@emotion/styled';
import { ToggleProps } from './Toggle';
import { hexToRgb } from 'src/styles/stylesUtil';

export const Label = styled.span<Pick<ToggleProps<unknown>, 'disabled'>>(({ theme, disabled }) => ({
    color: disabled ? theme.foregrounds.disabled : theme.foregrounds.primary,
    cursor: 'pointer',
    fontSize: 16
}));

export const Bar = styled.span<Pick<ToggleProps<unknown>, 'options' | 'value' | 'disabled'>>(({ theme, disabled, options, value }) => {
    const backgroundColor = value === options[0].value ? theme.colors.alto : theme.colors.calmingBlue;

    return {
        backgroundColor: disabled && value === options[1].value ? theme.backgrounds.disabled : backgroundColor,
        borderRadius: 8,
        display: 'block',
        height: 14,
        width: 36
    };
});

export const Icon = styled.span<Pick<ToggleProps<unknown>, 'disabled'>>(({ theme, disabled }) => ({
    backgroundColor: disabled ? theme.backgrounds.disabled : theme.backgrounds.inverted,
    borderRadius: 20,
    height: 20,
    width: 20,
    position: 'absolute',
    top: 9,
    transition: 'left 0.2s'
}));

export const IconWrapper = styled.div<Pick<ToggleProps<unknown>, 'disabled' | 'position'>>(({ theme, disabled, position }) => ({
    position: 'relative',
    ...(position === 'LEFT' ? { marginLeft: 12 } : { marginRight: 12 }),
    padding: '12px 0',
    cursor: 'pointer',
    ':hover span:nth-of-type(2)': {
        ...(!disabled && { boxShadow: `0 0 0 11px ${hexToRgb(theme.backgrounds.tinted, 0.2)}` }),
        transition: 'all 0.2s ease-in-out'
    },
    ':active span:nth-of-type(2)': {
        ...(!disabled && { boxShadow: `0 0 0 11px ${hexToRgb(theme.backgrounds.tinted, 0.4)}` }),
    }
}));

export const ToggleWrapper = styled.div(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    color: theme.foregrounds.primary
}));

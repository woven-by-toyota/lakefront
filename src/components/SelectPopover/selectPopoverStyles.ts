import styled from '@emotion/styled';

export const StyledSelectPopoverWrapper = styled.div(({ theme }) => ({
    display: 'inline',
    position: 'relative',
    color: theme.foregrounds.primary
}));

export const StyledSelectPopover = styled.div(({ theme }) => ({
    backgroundColor: theme.backgrounds.primary,
    border: `1px solid ${theme.borderColors.primary}`,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-55%)',
    zIndex: 2,
    color: theme.foregrounds.primary
}));

interface SelectPopoverItemProps {
    disabled?: boolean;
}

export const SelectPopoverItem = styled.div<SelectPopoverItemProps>(({ theme, disabled }) => ({
    alignItems: 'center',
    backgroundColor: theme.backgrounds.primary,
    color: disabled ? theme.foregrounds.disabled : theme.foregrounds.primary,
    cursor: 'pointer',
    display: 'flex',
    fontSize: 16,
    height: 40,
    minWidth: 160,
    padding: '0 12px',
    userSelect: 'none',
    zIndex: 2,
    ':hover': {
        backgroundColor: disabled ? theme.backgrounds.primary : theme.backgrounds.hover,
        cursor: disabled ? 'not-allowed' : undefined
    }
}));

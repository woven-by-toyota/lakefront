import styled from '@emotion/styled';

export const StyledStatusTrackerPopoverWrapper = styled.div(({ theme }) => ({
    display: 'inline',
    position: 'relative',
    color: theme.foregrounds.primary
}));

export const StyledStatusTrackerPopover = styled.div(({ theme }) => ({
    backgroundColor: theme.backgrounds.primary,
    border: `1px solid ${theme.borderColors.primary}`,
    borderRadius: 8,
    boxShadow: `0 1px 4px ${theme.shadowColors.boxShadow}`,
    padding: '16px 24px',
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: theme.zIndex.popover,
    minWidth: 400,
    maxWidth: 600,
    color: theme.foregrounds.primary
}));

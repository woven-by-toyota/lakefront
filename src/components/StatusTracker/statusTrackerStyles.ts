import styled from '@emotion/styled';

export const StyledStatusTracker = styled.div(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    color: theme.foregrounds.primary,
    padding: '16px 0',
    gap: 16,
    fontFamily: theme.lettering.h1.fontFamily,
}));

export const StatusNode = styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0
});

export const StatusContent = styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    position: 'relative'
});

interface StatusNodeCircleProps {
    color?: string;
}

export const StatusNodeCircle = styled.div<StatusNodeCircleProps>(({ theme, color }) => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: color || theme.foregrounds.success,
    flexShrink: 0,
    border: `2px solid ${color || theme.foregrounds.success}`,
    position: 'relative',
}));

export const StatusLine = styled.div(({ theme }) => ({
    flex: '1 1 auto',
    height: 1,
    backgroundColor: theme.borderColors.pronounced,
    marginTop: 8
}));

export const StatusLabel = styled.div(({ theme }) => ({
    fontSize: theme.lettering.primary.fontSize,
    fontWeight: 600,
    textAlign: 'center',
    color: theme.foregrounds.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%'
}));

export const StatusAboveDetails = styled.div(({ theme }) => ({
    fontSize: theme.lettering.secondary.fontSize,
    color: theme.foregrounds.secondary,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    border: `1px solid ${theme.borderColors.pronounced}`,
    padding: 8,
    borderRadius: 4,
    backgroundColor: theme.backgrounds.tinted
}));

export const StatusDescription = styled.div(({ theme }) => ({
    fontSize: theme.lettering.secondary.fontSize,
    color: theme.foregrounds.secondary,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%'
}));

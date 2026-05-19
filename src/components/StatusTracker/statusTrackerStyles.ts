import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

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
    alignSelf: 'flex-start',
    flexShrink: 0
});

export const StatusContent = styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    position: 'relative'
});

const pulseRing = keyframes`
    0% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(1.8);
        opacity: 0;
    }
`;

interface StatusNodeCircleProps {
    color?: string;
    active?: boolean;
}

export const StatusNodeCircle = styled.div<StatusNodeCircleProps>(({ theme, color, active }) => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: color || theme.foregrounds.secondary,
    flexShrink: 0,
    border: `2px solid ${color || theme.foregrounds.secondary}`,
    position: 'relative',
    zIndex: 1,
    ...(active && {
        '&::before': {
            content: '""',
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            borderRadius: '50%',
            border: `2px solid ${color || theme.foregrounds.secondary}`,
            animation: `${pulseRing} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`
        }
    })
}));

interface StatusLineProps {
    active?: boolean;
}

export const StatusLine = styled.div<StatusLineProps>(({ theme, active }) => ({
    flex: '1 1 auto',
    height: 1,
    backgroundColor: theme.foregrounds.primary,
    marginTop: 8,
    ...(active && {
        animation: `${fadePulse} 2s ease-in-out infinite`
    })
}));

const fadePulse = keyframes`
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
`;

interface StatusLabelProps {
    active?: boolean;
}

export const StatusLabel = styled.div<StatusLabelProps>(({ theme, active }) => ({
    fontSize: theme.lettering.primary.fontSize,
    fontWeight: 600,
    textAlign: 'center',
    color: theme.foregrounds.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    ...(active && {
        animation: `${fadePulse} 2s ease-in-out infinite`
    })
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

const skeletonPulse = keyframes`
    0%, 100% {
        opacity: 0.6;
    }
    50% {
        opacity: 0.3;
    }
`;

export const SkeletonCircle = styled.div(({ theme }) => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: theme.backgrounds.disabled,
    flexShrink: 0,
    border: `2px solid ${theme.backgrounds.disabled}`,
    animation: `${skeletonPulse} 1.5s ease-in-out infinite`
}));

interface SkeletonBarProps {
    width?: number;
    height?: number;
}

export const SkeletonBar = styled.div<SkeletonBarProps>(({ theme, width = 100, height = 16 }) => ({
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: 4,
    backgroundColor: theme.backgrounds.disabled,
    animation: `${skeletonPulse} 1.5s ease-in-out infinite`
}));

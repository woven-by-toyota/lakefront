import styled from '@emotion/styled';
import lakefrontColors from 'src/styles/lakefrontColors';

export const ProgressBarContainer = styled.div(({ theme }) => ({
    minHeight: '120px',
    color: theme.foregrounds.primary
}));

export const TopText = styled.div(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '5fr 10fr 5fr',
    paddingBottom: '10px',
    color: theme.foregrounds.primary,
    'span': {
        whiteSpace: 'nowrap'
    }
}));

export const CenterText = styled.span(({ theme }) => ({
    textAlign: 'center',
    color: theme.foregrounds.primary
}));

export const RightText = styled.span(({ theme }) => ({
    textAlign: 'right',
    color: theme.foregrounds.primary
}));

export const ProgressBar = styled.div(({ theme }) => ({
    position: 'relative',
    height: '32px',
    borderRadius: '4px',
    border: '1px solid',
    borderColor: theme.borderColors.secondary,
    background: theme.backgrounds.secondary,
    color: theme.foregrounds.primary
}));

export const Filler = styled.div<any>(({ width, backgroundColor, theme }) => ({
    height: '100%',
    borderRadius: 'inherit',
    transition: 'width .2s ease-in',
    width: width,
    backgroundColor: backgroundColor,
    display: 'flex',
    alignItems: 'center',
    color: theme.foregrounds.primary,
    span: {
        marginLeft: '1em'
    },
    position: 'absolute',
    zIndex: 1
}));

export const BottomText = styled.div(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '5fr 10fr 5fr',
    paddingTop: '20px',
    color: theme.foregrounds.primary
}));

interface ThresholdProps {
    color?: string;
    percentage: string;
}

export const Threshold = styled.div<ThresholdProps>(({ theme, color = lakefrontColors.red, percentage }) => ({
    width: percentage,
    borderRight: `4px solid ${color}`,
    height: '100%',
    position: 'absolute',
    zIndex: 2,
    color: theme.foregrounds.primary
}));

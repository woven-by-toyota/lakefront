import styled from '@emotion/styled';

export const ProgressStyle = styled.div<any>(({ width, theme }) => ({
    backgroundColor: theme?.colors?.selago,
    width: width,
    position: 'relative',
    height: '8px',
    color: theme.foregrounds.primary,
    'span': {
        position: 'absolute',
        display: 'block',
        height: '8px'
    }
}));


export const ProgressSpan = styled.span<any>(({ left, backgroundColor, width }) => ({
    left: left,
    backgroundColor: backgroundColor,
    width: width
}));

import styled from '@emotion/styled';

interface HighlightProps {
    left?: string;
    width?: string;
}

export const PlaybackStyle = styled.div({
    boxSizing: 'border-box',
    textAlign: 'center'
});

export const PlaySlider = styled.div(({ theme }) => ({
    ...theme.lettering.secondary,
    color: theme.foregrounds.inverted,
    display: 'grid',
    gridTemplateColumns: '100px auto 100px',
    gridRowGap: '0.5rem'
}));

export const Highlight = styled.div<HighlightProps>(({ theme, left, width }) => ({
    position: 'absolute',
    borderRadius: '6px',
    background: theme.foregrounds.success,
    height: '8px',
    margin: '3px 0',
    top: 0,
    left: left,
    width: width
}));

export const SliderContainer = styled.div({
    position: 'relative',
    height: '14px'
});

export const SliderBar = styled.div(({ theme }) => ({
    position: 'relative',
    borderRadius: '6px',
    background: theme.backgrounds.secondary,
    height: '8px',
    margin: '3px 0'
}));

export const SliderStyle = styled.div({
    position: 'absolute',
    top: 0,
    left: 0,
    background: 'transparent',
    height: '14px',
    width: '100%'
});

export const ThumbStyle = styled.div<any>(({ theme, left }) => ({
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    position: 'absolute',
    top: 0,
    background: theme.backgrounds.hover,
    cursor: 'grab',
    left: left
}));

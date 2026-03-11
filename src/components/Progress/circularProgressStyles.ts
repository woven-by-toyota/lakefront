import styled from '@emotion/styled';

export const CircularProgressStyle = styled.div<any>(({ width, theme }) => ({
    width,
    height: width,
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.foregrounds.primary,
    'svg': {
        position: 'absolute',
        top: 0,
        left: 0
    },
    'div': {
        position: 'fixed',
        textAlign: 'center',
        padding: '4px 8px',
        fontSize: '12px',
        color: theme.foregrounds.inverted,
        background: theme.backgrounds.inverted,
        border: 0,
        borderRadius: '8px',
        pointerEvents: 'none'
    }
}));

export const CenterTextStyle = styled.span(({ theme }) => ({
    fontSize: '24px',
    color: theme.foregrounds.secondary,
    textAlign: 'center'
}));

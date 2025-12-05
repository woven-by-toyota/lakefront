import styled from '@emotion/styled';
import Loading from 'src/components/Loading/Loading';

export const ToolbarContainer = styled.div<any>(({ standalone, theme }) => ({
    alignItems: 'center',
    backgroundColor: theme.backgrounds.primary,
    boxSizing: 'border-box',
    display: 'flex',
    height: '50px',
    zIndex: 1,
    padding: '0 16px',
    ...(standalone) && {
        borderBottom: '1px solid',
        borderColor: theme.borderColors.primary
    }
}));


export const LogoLoadingSpinner = styled(Loading)(({ width, height }) => ({
    'svg path': {
        fill: 'currentColor',
        width: width,
        height: height
    }
}));

export const RefreshProgressContainer = styled.div<any>(({ theme }) => ({
    alignItems: 'center',
    color: theme.foregrounds.loading,
    display: 'inline-flex',
    fontSize: '13px',
    paddingTop: '3px',
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
    },
    'img': {
        animation: 'spin 2s linear infinite',
        height: '24px',
        width: '24px',
        marginLeft: '5px',
        marginRight: '10px'
    },
    'span': {
        paddingTop: '4px'
    }
}));

export const ToolbarAdditionalContent = styled.div<any>(({ theme }) => ({
    display: 'inline-grid',
    gridTemplateColumns: '1fr minmax(225px, max-content)',
    width: '100%',
    zIndex: 'inherit'
}));

export const ButtonContainer = styled.div<any>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    button: {
        border: 0,
        borderRadius: '50%',
        height: '40px',
        width: '40px',
        minWidth: '40px',
        padding: 0,
        margin: '0 8px',
        'svg': {
            color: theme.foregrounds.primary
        },
        '&:hover': {
            backgroundColor: theme.backgrounds.hover,

            'svg path': {
                color: theme.foregrounds.primary
            }
        },
        '&:disabled': {
            'svg': {
                fill: theme.foregrounds.disabled
            }
        }
    }
}));

export const RightSideContainer = styled.div<any>(({ theme }) => ({
    alignItems: 'center',
    color: theme.foregrounds.secondary,
    display: 'inline-flex',
    fontSize: '13px',
    paddingTop: '3px',
    justifyContent: 'flex-end'
}));

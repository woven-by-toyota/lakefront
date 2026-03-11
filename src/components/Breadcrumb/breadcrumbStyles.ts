import styled from '@emotion/styled';

export const BreadCrumbStyle = styled.div(({ theme }) => ({
    display: 'grid',
    'nav': {
        alignSelf: 'center',
        display: 'flex',
    },
    'a': {
        color: theme.foregrounds.secondary,
        textDecoration: 'none',
        '&:hover': {
            color: theme.foregrounds.primary,
        }
    }
}));

export const Current = styled.span(({ theme }) => ({
    color: theme.foregrounds.primary,
    fontWeight: 500
}));

export const Divider = styled.span(({ theme }) => ({
    display: 'inline-block',
    margin: '0 10px',
    color: theme.foregrounds.primary
}));

export const Container = styled.div<any>(({ theme, standalone }) => ({
    display: 'grid',
    gridTemplateRows: '56px auto',
    color: theme.foregrounds.primary,
    ...((standalone) && {
        padding: '0 3.5rem',
        borderBottom: '1px solid',
        borderBottomColor: theme.borderColors.primary,
        backgroundColor: theme.backgrounds.primary
    })
}));

export const Content = styled.div(({ theme }) => ({
    display: 'grid',
    color: theme.foregrounds.primary
}));

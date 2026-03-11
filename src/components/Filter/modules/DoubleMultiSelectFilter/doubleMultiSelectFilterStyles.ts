import styled from '@emotion/styled';

export const FilterCount = styled.div(({ theme }) => ({
    alignItems: 'center',
    display: 'flex',
    color: theme.foregrounds.primary,
    span: {
        color: theme.foregrounds.inverted
    }
}));

export const FilterSection = styled.div(({ theme }) => ({
    margin: '16px 0',
    color: theme.foregrounds.primary
}));

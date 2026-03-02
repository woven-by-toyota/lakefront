import styled from '@emotion/styled';

export const FilterCount = styled.div(({ theme }) => ({
    alignItems: 'center',
    display: 'flex',
    span: {
        color: theme.foregrounds.inverted
    }
}));

export const FilterSection = styled.div({
    margin: '16px 0'
});

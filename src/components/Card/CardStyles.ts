import styled from '@emotion/styled';
import Button from 'src/components/Button/Button';

export const CardContentContainer = styled.div(({ theme }) => ({
    display: 'inline-grid',
    gridTemplateColumns: '1fr auto',
    gridTemplateRows: '55px auto auto',
    width: 250,
    height: 'auto',
    border: `1px solid ${theme.borderColors.primary}`,
    borderRadius: 3,
    padding: 10,
    color: theme.foregrounds.primary,
    background: theme.backgrounds.primary
}));

export const StyledH1Title = styled.h1(({ theme }) => ({
    fontSize: 18,
    height: 'min-content',
    color: theme.foregrounds.primary
}));

export const StyledDescription = styled.p(({ theme }) => ({
    gridArea: '2',
    marginTop: 'unset',
    fontSize: 14,
    color: theme.foregrounds.primary
}));

export const StyledContentContainer = styled.div(({ theme }) => ({
    gridArea: '3/1',
    color: theme.foregrounds.primary
}));

export const StyledMoreDetailsButton = styled(Button)(() => ({
    gridArea: '1/2'
}));

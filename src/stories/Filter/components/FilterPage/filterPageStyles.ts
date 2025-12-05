import styled from '@emotion/styled';

export const DefaultWrapper = styled.div(({ theme }) => ({
  color: theme.foregrounds.primary,
  backgroundColor: theme.backgrounds.primary,
  fontFamily: '"Source Sans Pro", sans-serif',
  margin: 0,
  display: 'grid',
  flexDirection: 'column',
  alignItems: 'center',
  border: theme.borders.primary
}));

export const PageBody = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
  color: theme.foregrounds.secondary,
  backgroundColor: theme.backgrounds.secondary,
  fontSize: 20,
  minHeight: 400
}));

export const PageWrapper = styled.div(({ theme }) => ({
  backgroundColor: theme.backgrounds.primary,
  fontFamily: '"Source Sans Pro", sans-serif',
  margin: 0,
  padding: 15,
  display: 'grid',
  flexDirection: 'column',
  width: '100%',
  border: `1px solid ${theme.borderColors.primary}`
}));

export const PageBodyWithCollapseSection = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  width: '100%',
  fontSize: 10,
  marginLeft: 5,
  minHeight: 400
}));

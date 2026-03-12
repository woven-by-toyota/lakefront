import styled from '@emotion/styled';

export const ConfirmationDiv = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    color: theme.foregrounds.primary,
    span: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left'
    },
    a: {
        display: 'inline-block',
        marginBottom: '40px'
    },
    h4: {
        marginBlockStart: 0,
        marginBlockEnd: 0,
        marginInlineStart: 0,
        marginInlineEnd: 0,
        marginTop: '12px'
    }
}));

export const ConfirmationTitle = styled.div(({ theme }) => ({
  ...theme.lettering.h5,
  marginLeft: '0.5em',
  color: theme.foregrounds.primary
}));

export const ConfirmationTitleDiv = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '0.5em',
  color: theme.foregrounds.primary,
  svg: {
    height: '2.5em',
    width: '2.5em',
    fill: theme.foregrounds.primary
  },
  'svg.error-icon': {
    fill: theme.foregrounds.alert
  }
}));

export const ConfirmationContentSpan = styled.span(({ theme }) => ({
    margin: '23px 0 33px 0',
    textAlign: 'left',
    color: theme.foregrounds.primary
}));

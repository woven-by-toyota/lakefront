import styled from '@emotion/styled';

export const ConfirmationDiv = styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
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
});

export const ConfirmationTitle = styled.div(({ theme }) => ({
  ...theme.lettering.h5,
  marginLeft: '0.5em'
}));

export const ConfirmationTitleDiv = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '0.5em',
  svg: {
    height: '2.5em',
    width: '2.5em'
  },
  'svg.error-icon': {
    fill: theme.foregrounds.alert
  }
}));

export const ConfirmationContentSpan = styled.span({
    margin: '23px 0 33px 0',
    textAlign: 'left'
});

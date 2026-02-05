import styled from '@emotion/styled';

export const SettingsRowContainer = styled.div(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1em 0.5em',
  '.button-container': {
    button: {
      borderRadius: 4,
      border: `1px solid ${theme.borderColors.primary}`,
      width: 36,
      height: 36,
      boxShadow: '0 1px 1px rgba(0, 0, 0, 0.15)'
    },
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    svg: {
      fill: theme.foregrounds.secondary
    },
  },
}));

export const SettingsOpenBackgroundContainer = styled.div(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '80vh',
  width: '100%',
  backgroundColor: 'transparent',
  cursor: 'pointer'
}));

export const SettingsOpenForegroundContainer = styled.div(({ theme }) => ({
  position: 'absolute',
  zIndex: theme.zIndex.modal,
  top: '3em',
  left: '3em',
  backgroundColor: theme.backgrounds.primary,
  color: theme.foregrounds.primary,
  borderRadius: 4,
  boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)',
  minWidth: 400,
  maxWidth: '90vw',
  maxHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'auto',
  padding: '1em'
}));

export const SettingsHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.borderColors.primary}`,
  paddingBottom: 8,
  h4: {
    ...theme.lettering.h4,
    margin: 0,
    color: theme.foregrounds.primary,
  },
  '.close-icon': {
    height: 36,
    width: 36,
    svg: {
      fill: theme.foregrounds.secondary
    }
  }
}));

export const SettingsContent = styled.div(({ theme }) => ({
  padding: '1em',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  rowGap: 8,
  h5: {
    ...theme.lettering.h5,
    margin:0,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
}));

export const ColumnCheckboxList = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

export const TableWrapper = styled.div({
  position: 'relative',
});

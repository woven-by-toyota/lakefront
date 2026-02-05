import styled from '@emotion/styled';

export const SettingsRowContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '.button-container': {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    svg: {
      fill: theme.foregrounds.secondary
    }
  },
  overflow: 'hidden'
}));

export const SettingsOpenBackgroundContainer = styled.div({
  position: 'absolute',
  height: '100%',
  width: '100%',
  backgroundColor: 'transparent',
  cursor: 'pointer'
});

export const SettingsOpenForegroundContainer = styled.div(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.backgrounds.primary,
  color: theme.foregrounds.primary,
  borderRadius: 4,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
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

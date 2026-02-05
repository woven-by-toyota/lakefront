import styled from '@emotion/styled';
import colors from 'src/styles/lakefrontColors';

export const SettingsRowContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  '.button-container': {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    svg: {
      fill: theme.foregrounds.secondary
    }
  }
}));

export const SettingsOverlay = styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  zIndex: 1000,
  cursor: 'pointer'
});

export const SettingsContainer = styled.div(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme?.backgrounds?.primary || '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  zIndex: 1001,
  minWidth: '400px',
  maxWidth: '90vw',
  maxHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'auto'
}));

export const SettingsHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 24px',
  borderBottom: `1px solid ${theme?.colors?.selago || colors.selago}`,

  h3: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: theme?.colors?.arsenic || colors.arsenic,
  }
}));

export const SettingsCloseButton = styled.button(({ theme }) => ({
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '32px',
  lineHeight: '24px',
  padding: '4px 8px',
  color: theme?.colors?.pavement || colors.pavement,
  transition: 'color 0.2s ease',

  '&:hover': {
    color: theme?.colors?.arsenic || colors.arsenic,
  },

  '&:focus': {
    outline: `2px solid ${theme?.colors?.primary || colors.blueberry}`,
    outlineOffset: '2px',
  }
}));

export const SettingsContent = styled.div(({ theme }) => ({
  padding: '24px',
  overflowY: 'auto',

  h4: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    fontWeight: 600,
    color: theme?.colors?.arsenic || colors.arsenic,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
}));

export const ColumnCheckboxList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
});

export const TableWrapper = styled.div({
  position: 'relative',
});

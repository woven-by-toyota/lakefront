import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const DEFAULT_SETTINGS_ROW_HEIGHT = 56;
export const MIN_SETTINGS_ROW_HEIGHT = 22;

const pulseBorderGlow = keyframes`
  0%, 100% {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15), 0 0 0 0 rgba(0, 123, 255, 0);
  }
  50% {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15), 0 0 4px 1px rgba(0, 123, 255, 0.4);
  }
`;

interface SettingsRowContainerProps {
  sticky?: boolean;
  hasModifiedSettings?: boolean;
}

export const SettingsRowContainer = styled.div<SettingsRowContainerProps>(({ theme, sticky, hasModifiedSettings }) => ({
  position: 'relative',
  ...(sticky && {
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.tableHeader + 1, // ensure it appears above the table header
    backgroundColor: theme.backgrounds.primary,
  }),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1em 0.5em',
  '.button-container': {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    columnGap: 4,
    button: {
      borderRadius: 4,
      border: `1px solid ${theme.borderColors.primary}`,
      width: 36,
      height: 36,
      boxShadow: '0 1px 1px rgba(0, 0, 0, 0.15)',

    },
    'button.settings-icon': {
      border: `1px solid ${hasModifiedSettings ? theme.foregrounds.hyperlink : theme.borderColors.primary}`,
      ...(hasModifiedSettings && {
        animation: `${pulseBorderGlow} 2s ease-in-out infinite`
      })
    },
    svg: {
      fill: theme.foregrounds.secondary
    },
    '.settings-icon svg': {
      fill: hasModifiedSettings ? theme.foregrounds.hyperlink : theme.foregrounds.secondary
    },
  },
}));

interface TextButtonContainerProps {
  sticky?: boolean;
  hasModifiedSettings?: boolean;
}

export const TextButtonContainer = styled.div<TextButtonContainerProps>(({ theme, sticky, hasModifiedSettings }) => ({
  position: 'relative',
  ...(sticky && {
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.tableHeader + 1,
    backgroundColor: theme.backgrounds.primary,
  }),
  height: 28,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  boxSizing: 'border-box',
  borderBottom: `1px solid ${theme.borderColors.primary}`,
  padding: 2,
  width: '100%',
  '.text-button': {
    minWidth: 'fit-content',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 4,
    height: MIN_SETTINGS_ROW_HEIGHT,
    padding: '0.75em 1.5em',
    background: 'transparent',
    color: theme.foregrounds.secondary,
    border: 'none',
    svg: {
      fill: theme.foregrounds.secondary,
      width: MIN_SETTINGS_ROW_HEIGHT,
      height: MIN_SETTINGS_ROW_HEIGHT
    },
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.backgrounds.tinted,
    },
    '&:not(:last-child)': {
      borderRight: `1px solid ${theme.borderColors.primary}`
    }
  },
  '.text-button.settings-button': {
    color: hasModifiedSettings ? theme.foregrounds.hyperlink : theme.foregrounds.secondary,
    svg: {
      fill: hasModifiedSettings ? theme.foregrounds.hyperlink : theme.foregrounds.secondary,
    },
  }
}));

export const SettingsOpenBackgroundContainer = styled.div(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '80vh',
  width: '100%',
  backgroundColor: 'transparent',
  cursor: 'pointer'
}));

export const SettingsOpenForegroundContainer = styled.div<{ position?: 'left' | 'right' }>(({ theme, position = 'left' }) => ({
  position: 'absolute',
  zIndex: theme.zIndex.modal,
  top: '3em',
  [position]: '3em',
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
  },
}));

export const SettingsContentSection = styled(SettingsContent)(({ theme }) => ({
  border: `1px solid ${theme.borderColors.primary}`,
  borderRadius: 4,
  flex: 1
}));

export const ColumnCheckboxList = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

interface TableWrapperProps {
  hasSettings?: boolean;
  stickyHeaders?: boolean;
  settingsRowHeight?: number;
}

export const TableWrapper = styled.div<TableWrapperProps>(({ hasSettings, stickyHeaders, settingsRowHeight }) => ({
  position: 'relative',
  ...(hasSettings && stickyHeaders && {
    '--settings-row-height': `${settingsRowHeight || DEFAULT_SETTINGS_ROW_HEIGHT}px`
  })
}));

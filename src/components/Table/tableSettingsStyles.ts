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
  color: theme.foregrounds.primary,
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
  color: theme.foregrounds.primary,
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

export const SettingsOpenBackgroundContainer = styled.div({
  position: 'absolute',
  top: 0,
  height: '80vh',
  width: '100%',
  backgroundColor: 'transparent',
  cursor: 'pointer'
});

// Horizontal inset shared by every element in the settings panel, so headings, preset labels and
// column checkboxes all line up on the same left edge. The panel itself is unpadded, which lets
// selectable rows and section dividers span its full width.
const PANEL_INSET = 14;

// Width of the accent bar that marks the applied preset. It is part of the row's left padding so
// the label does not shift when a row becomes selected.
const PRESET_ACCENT_WIDTH = 3;

export const SettingsOpenForegroundContainer = styled.div<{ position?: 'left' | 'right' }>(({ theme, position = 'left' }) => ({
  position: 'absolute',
  zIndex: theme.zIndex.modal,
  top: '3em',
  [position]: '3em',
  backgroundColor: theme.backgrounds.primary,
  color: theme.foregrounds.primary,
  border: `1px solid ${theme.borderColors.primary}`,
  borderRadius: 4,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
  minWidth: 295,
  maxWidth: '90vw',
  maxHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'auto',
  // Each child applies PANEL_INSET itself so rows and dividers can span the full panel width
  padding: 0
}));

export const SettingsHeader = styled.div(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 44,
  boxSizing: 'border-box',
  padding: `0 ${PANEL_INSET}px`,
  borderBottom: `1px solid ${theme.borderColors.primary}`,
  h4: {
    ...theme.lettering.h4,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '21px',
    margin: 0,
    color: theme.foregrounds.primary,
  },
  '.close-icon': {
    height: 26,
    width: 26,
    svg: {
      height: 15,
      width: 15,
      fill: theme.foregrounds.secondary
    }
  }
}));

export const SettingsContent = styled.div(({ theme }) => ({
  padding: 0,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  // Allows the content to shrink below its intrinsic height so it scrolls instead of growing the panel
  minHeight: 0,
  color: theme.foregrounds.primary,
  // Section headings sit above their content rather than beside it, so they carry their own spacing
  h5: {
    ...theme.lettering.h5,
    fontSize: 11,
    fontWeight: 700,
    lineHeight: '16.5px',
    margin: 0,
    padding: `12px ${PANEL_INSET}px 4px`,
    textTransform: 'uppercase',
    letterSpacing: '0.66px',
    color: theme.foregrounds.secondary
  },
}));

export const SettingsContentSection = styled(SettingsContent)({
  // Trailing space so the last row is not flush against the bottom of the panel
  padding: '0 0 8px',
  flex: 1
});

// Separates the stacked sections in the panel. Spans the full panel width, matching the header rule,
// so it reads as a hard boundary between sections
export const SettingsSectionDivider = styled.div(({ theme }) => ({
  flexShrink: 0,
  height: 1,
  marginTop: 10,
  backgroundColor: theme.borderColors.primary
}));

// Width of the grid column holding a column checkbox. The checkbox shares the cell with its check
// icon, which is wider than the box itself, so this clears the icon and still leaves a gap before
// the label. Resizing the icon is not an option: it would knock the check off centre in the box.
const CHECKBOX_COLUMN_WIDTH = 28;

export const ColumnCheckboxList = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  color: theme.foregrounds.primary,
  // Compact rows aligned to the panel inset, matching the preset rows above
  label: {
    boxSizing: 'border-box',
    padding: `5px ${PANEL_INSET}px`,
    gridTemplateColumns: `${CHECKBOX_COLUMN_WIDTH}px auto`,
    fontSize: 13,
    fontWeight: 500,
    lineHeight: '19.5px'
  },
  // Show/Hide All governs the columns beneath it, so space rather than a rule sets it apart
  'label.checkbox-group-all': {
    marginBottom: 12
  }
}));

export const PresetList = styled.div({
  display: 'flex',
  flexDirection: 'column'
});

interface PresetRowProps {
  selected?: boolean;
  modified?: boolean;
}

export const PresetRow = styled.button<PresetRowProps>(({ theme, selected, modified }) => {
  const accentColor = modified ? theme.foregrounds.warning : theme.foregrounds.hyperlink;
  const labelColor = modified ? theme.foregrounds.warningPronounced : theme.foregrounds.selected;

  return {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    columnGap: 8,
    width: '100%',
    height: 32,
    boxSizing: 'border-box',
    // Spans the full panel width so the selected highlight reads as a menu row, with the label
    // still landing on PANEL_INSET once the accent bar is accounted for
    padding: `0 ${PANEL_INSET}px 0 ${PANEL_INSET - PRESET_ACCENT_WIDTH}px`,
    background: selected
      ? (modified ? theme.backgrounds.warningSubtle : theme.backgrounds.selected)
      : 'transparent',
    border: 'none',
    borderLeft: `${PRESET_ACCENT_WIDTH}px solid ${selected ? accentColor : 'transparent'}`,
    color: selected ? labelColor : theme.foregrounds.primary,
    cursor: 'pointer',
    textAlign: 'left',
    // Buttons do not inherit the page font, so match the column checkbox labels explicitly
    fontFamily: 'inherit',
    fontSize: 13,
    lineHeight: '19.5px',
    fontWeight: selected ? 500 : 400,
    '&:hover': {
      backgroundColor: selected
        ? (modified ? theme.backgrounds.warningSubtle : theme.backgrounds.selected)
        : theme.backgrounds.tinted
    },
    '.preset-label': {
      display: 'flex',
      alignItems: 'center',
      columnGap: 6,
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    }
  };
});

export const PresetModifiedChip = styled.span(({ theme }) => ({
  flexShrink: 0,
  padding: '0 4px',
  borderRadius: 3,
  backgroundColor: theme.backgrounds.warningTint,
  color: theme.foregrounds.warningPronounced,
  fontSize: 10,
  fontWeight: 600,
  lineHeight: '15px'
}));

export const PresetColumnCount = styled.span(({ theme }) => ({
  flexShrink: 0,
  color: theme.foregrounds.secondary,
  fontSize: 11,
  fontWeight: 500,
  lineHeight: '16.5px'
}));

// A soft grouping rule inside the preset list. It is inset to the panel content and lighter than the
// section dividers so it groups rows without reading as a section boundary
export const PresetGroupDivider = styled.div(({ theme }) => ({
  flexShrink: 0,
  height: 1,
  margin: `6px ${PANEL_INSET}px`,
  backgroundColor: theme.borderColors.subtle
}));

export const UnsavedChangesCallout = styled.div(({ theme }) => ({
  boxSizing: 'border-box',
  // Inset slightly tighter than the panel content so the bordered box does not crowd the rows
  margin: '8px 10px 0',
  padding: '8px 10px',
  borderRadius: 4,
  border: `1px solid ${theme.borderColors.warning}`,
  backgroundColor: theme.backgrounds.warningSubtle,
  color: theme.foregrounds.warningPronounced,
  p: {
    margin: 0,
    fontSize: 11.5,
    fontWeight: 500,
    lineHeight: '17.25px'
  },
  '.callout-actions': {
    display: 'flex',
    alignItems: 'center',
    columnGap: 6,
    paddingTop: 6
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 3,
    padding: '4px 8px',
    borderRadius: 3,
    border: `1px solid ${theme.foregrounds.warning}`,
    background: 'transparent',
    color: theme.foregrounds.warningPronounced,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 11,
    fontWeight: 500,
    lineHeight: '16.5px',
    '&:hover': {
      backgroundColor: theme.backgrounds.warningTint
    }
  },
  'button.save-preset-button': {
    flex: 1
  },
  'button.revert-preset-button svg': {
    width: 10,
    height: 10,
    flexShrink: 0,
    fill: theme.foregrounds.warningPronounced
  }
}));

interface TableWrapperProps {
  hasSettings?: boolean;
  stickyHeaders?: boolean;
  settingsRowHeight?: number;
}

export const TableWrapper = styled.div<TableWrapperProps>(({ theme, hasSettings, stickyHeaders, settingsRowHeight }) => ({
  position: 'relative',
  color: theme.foregrounds.primary,
  ...(hasSettings && stickyHeaders && {
    '--settings-row-height': `${settingsRowHeight || DEFAULT_SETTINGS_ROW_HEIGHT}px`
  })
}));

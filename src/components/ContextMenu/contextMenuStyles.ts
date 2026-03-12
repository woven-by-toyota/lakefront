import styled from '@emotion/styled';

interface ContextMenuProps {
  top: number;
  left: number;
}

export const StyledContextMenu = styled.div<ContextMenuProps>(({ theme, top, left }) => ({
  backgroundColor: theme.backgrounds.primary,
  border: `1px solid ${theme.borderColors.primary}`,
  borderRadius: 4,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  zIndex: 1000,
  minWidth: 180,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  top: top,
  left: left,
  position: 'fixed',
  padding: '4px 8px',
  color: theme.foregrounds.primary
}));

export const StyledSeparator = styled.hr(({theme}) => ({
  margin: '4px 0',
  border: 'none',
  borderTop: `1px solid ${theme.borderColors.primary}`,
  color: theme.foregrounds.primary
}));

export const StyledMenuItem = styled.div<{ disabled?: boolean }>(({ theme, disabled }) => ({
  alignItems: 'center',
  backgroundColor: 'transparent',
  color: disabled ? theme.foregrounds.disabled : theme.foregrounds.primary,
  cursor: 'pointer',
  display: 'flex',
  fontSize: 14,
  userSelect: 'none',
  ':hover': {
    backgroundColor: disabled ? 'transparent' : theme.backgrounds.hover,
    cursor: disabled ? 'not-allowed' : 'pointer',
  },
  padding: '4px 8px',
  borderRadius: 4
}));

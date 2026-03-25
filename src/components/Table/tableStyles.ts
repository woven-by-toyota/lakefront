import styled from '@emotion/styled';
import { ReactComponent as ArrowUp } from './assets/arrow_drop_up.svg';
import { ReactComponent as ArrowDown } from './assets/arrow_drop_down.svg';
import { ReactComponent as Unsorted } from './assets/unsorted.svg';
import {lightenDarkenColor} from "../../styles/stylesUtil";

export const TableStyle = styled.table(({ theme }) => ({
  padding: 0,
  margin: 0,
  borderSpacing: 0,
  width: '100%',
  color: theme.foregrounds.primary,
  ...theme.lettering.primary,
  'tr': {
    color: theme.foregrounds.primary,
    ':last-child': {
      'td': {
        borderBottom: 0
      }
    }
  },
  'th': {
    color: theme.foregrounds.tableHeading,
    position: 'relative',
    textAlign: 'left',
    'svg': {
      marginTop: 2,
      position: 'absolute',
      top: 6,
      fill: theme.foregrounds.tableHeading
    }
  },
  'th,td': {
    margin: 0,
    padding: '0.8rem',
    borderBottom: '1px solid',
    borderBottomColor: theme.borderColors.primary,
    backgroundColor: theme.backgrounds.primary,

    '&.noBorder': {
      borderBottom: 0,
      padding: '0.4rem'
    },

    '&.marginBottom': {
      marginBottom: 5
    },
    svg: {
      fill: theme.foregrounds.tableHeading
    }
  }
}));

export const HeaderCell = styled.th<{ headerWidth?: number }>(({ headerWidth }) => ({
  '.header-content-wrapper': {
    ...(headerWidth && { width: headerWidth })
  }
}));

export const StyledHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  color: theme.foregrounds.primary,
  'div:first-of-type': {
    width: 'max-content'
  }
}));

export const StyledHeaderContent = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  'svg.sort-icon': {
    marginTop: 0,
    position: 'static',
    fill: theme.foregrounds.tableHeading
  }
}));

export const ColumnResizeHandle = styled.div<{ showHandle?: boolean }>(({ theme, showHandle = true })=> ({
  width: 2,
  height: 16,
  backgroundColor: showHandle ? `${theme.borderColors.primary}E6` : 'transparent',
  marginLeft: 16
}));

export const ResizerContainer = styled.div(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  height: '100%',
  width: 20,
  cursor: 'ew-resize',
  userSelect: 'none',
  touchAction: 'none',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.foregrounds.primary
}));

export const StyledArrowDown = styled(ArrowDown)(({ theme }) => ({
  paddingLeft: 5,
  paddingTop: 3,
  color: theme.foregrounds.primary
}));

export const StyledArrowUp = styled(ArrowUp)(({ theme }) => ({
  paddingLeft: 5,
  paddingTop: 3,
  color: theme.foregrounds.primary
}));

export const StyledUnsorted = styled(Unsorted)(({ theme }) => ({
  marginLeft: 8,
  position: 'relative',
  top: 10,
  color: theme.foregrounds.primary
}));

interface HideableTHeadProps {
  hide: boolean;
  sticky?: boolean;
  hasSettings?: boolean;
}

export const HideableTHead = styled.thead<HideableTHeadProps>(({ hide, sticky, theme, hasSettings }) => ({
  visibility: hide ? 'collapse' : 'visible',
  ...(sticky && {
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.tableHeader,
    '& th': {
      backgroundColor: theme.backgrounds.primary,
      boxShadow: '0 2px 0px rgba(0, 0, 0, 0.05)'
    }
  }),
  ...(hasSettings && {
    top: 'var(--settings-row-height, 0px)'
  })
}));

export const ErrorMessage = styled.td(({ theme }) => ({
  color: theme.foregrounds.error,
}));

export const GroupedCell = styled.td<{ isLastInGroup?: boolean }>(({ theme, isLastInGroup }) => ({
  '&&': {
    backgroundColor: theme.backgrounds.table.groupedRowSecondary,
    borderRight: `1px solid ${theme.borderColors.secondary}`,
    borderBottom: !isLastInGroup
      ? `2px solid ${theme.borderColors.secondary}`
      : `1px solid ${theme.borderColors.primary}`,
    verticalAlign: 'middle',
    fontWeight: '600',
    color: theme.foregrounds.primary,
    textAlign: 'center'
  }
}));

export const GroupedRowCell = styled.td<{ groupIndex: number; isLastInGroup?: boolean; alternatingColors?: boolean }>(({ theme, groupIndex, isLastInGroup, alternatingColors = true}) => ({
  '&&': {
    backgroundColor: alternatingColors && groupIndex % 2 === 1
      ? theme.backgrounds.secondary
      : theme.backgrounds.table.groupedRowPrimary,
    ...(isLastInGroup && {
      borderBottom: `2px solid ${theme.borderColors.secondary}`,
    })
  }
}));

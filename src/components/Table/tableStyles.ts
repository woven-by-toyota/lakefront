import styled from '@emotion/styled';
import { ReactComponent as ArrowUp } from './assets/arrow_drop_up.svg';
import { ReactComponent as ArrowDown } from './assets/arrow_drop_down.svg';
import { ReactComponent as Unsorted } from './assets/unsorted.svg';

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

export const StyledHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  'div:first-of-type': {
    width: 'max-content'
  }
});

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

export const ColumnResizeHandle = styled.div({
  position: 'absolute',
  right: 0,
  top: 0,
  height: '100%',
  width: 5,
  cursor: 'col-resize',
  userSelect: 'none',
  touchAction: 'none'
});

export const StyledArrowDown = styled(ArrowDown)({
  paddingLeft: 5,
  paddingTop: 3
});

export const StyledArrowUp = styled(ArrowUp)({
  paddingLeft: 5,
  paddingTop: 3
});

export const StyledUnsorted = styled(Unsorted)({
  marginLeft: 8,
  position: 'relative',
  top: 10
});

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
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    }
  }),
  ...(hasSettings && {
    top: 'var(--settings-row-height, 0px)'
  })
}));

export const ErrorMessage = styled.td(({ theme }) => ({
  color: theme.foregrounds.error,
}));

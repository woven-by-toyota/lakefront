import styled from '@emotion/styled';
import { FilterContainerProps } from './types';
import Button from '../Button';

const FILTER_BAR_HEIGHT = 48;

export const FilterContainer = styled.div<FilterContainerProps>(({ theme, showJSONInput, isCollapsed, hideFilterBar }) => ({
  display: 'grid',
  gridTemplateColumns: '264px minmax(min-content, auto)',
  gridTemplateRows: hideFilterBar === true ?
    '1fr' :
    `${FILTER_BAR_HEIGHT}px auto`,
  color: theme.foregrounds.primary,
  ...(showJSONInput && {
    gridTemplateColumns: 'minmax(min-content, max-content) minmax(min-content, auto)'
  }),
  ...(isCollapsed && {
    gridTemplateColumns: '57px minmax(min-content, auto)',
    '.sidePanel': {
      padding: '1rem'
    },
    '.filterHeader': {
      borderBottom: 'none',
      '.filterMenuIcon': {
        transform: 'rotate(90deg)'
      }
    },
    '.filters, .jsonInputSection': {
      display: 'none'
    }
  })
}));

export const SidePanel = styled.div(({ theme }) => {
  const primaryBorder = `1px solid ${theme.borderColors.primary}`;

  return {
    padding: '1rem',
    backgroundColor: theme.backgrounds.primary,
    borderRight: primaryBorder,
    gridRow: '1 / 3',
    h2: {
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: 16,
      fontWeight: 700,
      margin: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      textTransform: 'uppercase',
      height: 21,
      padding: '0 0 10px'
    },
    '.header-chips': {
      borderTop: 'unset',
      borderBottom: primaryBorder
    },
    section: { padding: '16px 0', borderBottom: primaryBorder },
    '.options': {
      paddingLeft: 14
    }
  };
});

export const FilterHeader = styled.h2(({ theme }) => ({
  color: theme.foregrounds.primary,
  '.filterContextTriggerContent': {
    fontSize: 'inherit'
  },
  '.filterMenuIcon': {
    cursor: 'pointer',
    transform: 'rotate(-90deg)'
  },
  svg: {
    fill: theme.foregrounds.primary
  }
}));

export const FilterChipsContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 4,
  color: theme.foregrounds.primary
}));

export const FiltersSection = styled.div(({ theme }) => ({
  position: 'relative',
  color: theme.foregrounds.primary,
  '> span': {
    position: 'absolute',
    top: 16,
    right: 0
  }
}));

export const FilterSectionDescription = styled.p(({ theme }) => ({
  color: theme.foregrounds.secondary,
  fontSize: 14,
  margin: '8px 0 4px'
}));

export const FilterSectionBody = styled.div(({ theme }) => ({
  marginTop: 8,
  color: theme.foregrounds.primary
}));

export const PresetFiltersContainer = styled.div(({ theme }) => ({
  marginBottom: 10,
  color: theme.foregrounds.primary
}));

export const FilterPaneControls = styled.div(({ theme }) => ({
  margin: '4px 0',
  display: 'flex',
  flexDirection: 'row-reverse',
  color: theme.foregrounds.primary
}));

export const FilterControl = styled(Button)({
  height: 30,
  border: 'none',
  fontSize: 14,
  display: 'flex'
});

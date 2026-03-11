import styled from '@emotion/styled';
import TableComponent from 'src/components/Table';

export const ChevronContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  color: theme.foregrounds.primary,
  svg: {
    stroke: theme.foregrounds.primary
  }
}));

export const SubComponentTr = styled.tr(({ theme }) => ({
  'td.table-wrapper-td': {
    padding: 0
  },
  boxShadow: '0px 4px 4px #F5F5F5',
  color: theme.foregrounds.primary
}));

export const TableWrapperTd = styled.td(({ theme }) => ({
  'td:first-of-type, td:last-of-type': {
    content: '""',
    display: 'block',
    margin: '0 auto 0 1em',
    borderBottom: `1px solid ${theme.borderColors.primary}`
  },
  'td:last-of-type': {
    margin: '0 1em 0 auto'
  },
  color: theme.foregrounds.primary
}));

export const StyledTableComponent = styled(TableComponent)(({ theme }) => ({
  color: theme.foregrounds.primary,
  td: {
    fontWeight: 'bold'
  },
  table: {
    td: {
      fontWeight: 'normal'
    }
  }
}));

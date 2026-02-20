import styled from '@emotion/styled';
import lakefrontColors from 'src/styles/lakefrontColors';
import TableComponent from 'src/components/Table';

export const ChevronContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  svg: {
    stroke: lakefrontColors.black
  }
});

export const SubComponentTr = styled.tr({
  'td.table-wrapper-td': {
    padding: 0
  },
  boxShadow: '0px 4px 4px #F5F5F5'
});

export const TableWrapperTd = styled.td({
  'td:first-of-type, td:last-of-type': {
    content: '""',
    display: 'block',
    margin: '0 auto 0 1em',
    borderBottom: `1px solid ${lakefrontColors.selago}`
  },
  'td:last-of-type': {
    margin: '0 1em 0 auto'
  }
});

export const StyledTableComponent = styled(TableComponent)({
  td: {
    fontWeight: 'bold'
  },
  table: {
    td: {
      fontWeight: 'normal'
    }
  }
});

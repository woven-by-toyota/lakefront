import { ChevronContainer, SubComponentTr, TableWrapperTd } from 'src/stories/Table/tableStoryStyles';
import { ReactComponent as ChevronUp } from 'src/components/Collapsible/assets/chevron-up.svg';
import { ReactComponent as ChevronDown } from 'src/components/Collapsible/assets/chevron-down.svg';
import TableComponent, { TableProps } from 'src/components/Table';

export const COLUMNS = [
  {
    header: 'TITLE',
    accessorKey: 'title',
    cell: ({ getValue }) => getValue()
  },
  {
    header: 'VALUE',
    accessorKey: 'value'
  },
  {
    header: 'PERCENTAGE',
    accessorKey: 'percentage'
  },
  {
    header: 'PERCENTAGE CHANGE',
    accessorKey: 'percentage_change',
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value?.toFixed(4) || '';
    }
  },
  {
    header: 'TOTAL/100',
    accessorKey: 'total',
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value?.toFixed(4) || '';
    }
  }
];

export const FAULTY_COLUMNS = [
  ...COLUMNS,
  {
    header: 'CREATION',
    accessorKey: 'metadata',
    cell: ({ getValue }) => {
      return getValue().created;
    }
  },
];

export const EXPORT_COLUMNS: TableProps['columns'] = [
  ...COLUMNS,
  {
    header: 'COMPARE_TOTAL',
    accessorKey: 'compare_total',
    cell: ({ getValue }) => {
      const value = getValue()?.nested;
      return <div>{value ? value.toString() : 'no value'}</div>;
    },
    meta: {
      csvValue: val => val?.nested ? val.nested.toString() : 'no value'
    }
  },
];

export const COLUMNS_WITH_WIDTH = [
  {
    header: 'TITLE',
    accessorKey: 'title',
    size: 100,
    cell: ({ getValue }) => getValue()
  },
  {
    header: 'VALUE',
    accessorKey: 'value',
    size: 100
  },
  {
    header: 'PERCENTAGE',
    accessorKey: 'percentage',
    size: 100
  },
  {
    header: 'PERCENTAGE CHANGE',
    accessorKey: 'percentage_change',
    size: 140,
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value?.toFixed(4) || '';
    }
  },
  {
    header: 'TOTAL/100',
    accessorKey: 'total',
    size: 50,
    enableSorting: false,
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value?.toFixed(4) || '';
    }
  }
];

const SMALLEST_COL_WIDTH = 20;

export const COLUMNS_WITH_RESIZING = [
  {
    header: 'TITLE',
    accessorKey: 'title',
    size: 250,
    minSize: 30,
    enableResizing: true,
    cell: ({ getValue }) => getValue()
  },
  {
    header: 'VALUE',
    accessorKey: 'value',
    size: SMALLEST_COL_WIDTH,
    minSize: 10,
    maxSize: SMALLEST_COL_WIDTH * 2,
    enableResizing: true
  },
  {
    header: 'PERCENTAGE',
    accessorKey: 'percentage',
    size: SMALLEST_COL_WIDTH,
    minSize: SMALLEST_COL_WIDTH,
    enableResizing: true
  },
  {
    header: 'PERCENTAGE CHANGE',
    accessorKey: 'percentage_change',
    size: SMALLEST_COL_WIDTH,
    minSize: SMALLEST_COL_WIDTH,
    enableResizing: true,
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value?.toFixed(4) || '';
    }
  },
  {
    header: 'TOTAL/100',
    accessorKey: 'total',
    size: SMALLEST_COL_WIDTH,
    minSize: SMALLEST_COL_WIDTH,
    enableResizing: false,
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value?.toFixed(4) || '';
    }
  }
];

export const COLUMNS_WITH_WIDTH_AND_EXPANDER = [
  ...COLUMNS_WITH_WIDTH,
  {
    header: '',
    id: 'expander',
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <ChevronContainer onClick={row.getToggleExpandedHandler()}>
          {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
        </ChevronContainer>
      );
    }
  }
];

export const GROUPED_ROWS_COLUMNS = [
  {
    header: 'Genre',
    accessorKey: 'genre',
    cell: ({ getValue }) => getValue()
  },
  {
    header: 'Title',
    accessorKey: 'title',
    cell: ({ getValue }) => getValue()
  },
  {
    header: 'Author',
    accessorKey: 'author',
    cell: ({ getValue }) => getValue()
  },
  {
    header: 'Pages',
    accessorKey: 'pages',
    cell: ({ getValue }) => getValue()
  },
  {
    header: 'Rating',
    accessorKey: 'rating',
    cell: ({ getValue }) => `⭐ ${getValue()}`
  }
];

export const renderRowSubComponent = ({ row }) => {
  const { value, percentage, percentage_change, total } = row.original;
  const nestedData = [
    {
      title: 'halved',
      value: value / 2,
      percentage: percentage / 2,
      percentage_change: percentage_change / 2,
      total: total / 2
    },
    {
      title: 'doubled',
      value: 24 * 2,
      percentage: percentage * 2,
      percentage_change: percentage_change * 2,
      total: total * 2
    }
  ];

  const subColumns = [
    ...COLUMNS_WITH_WIDTH_AND_EXPANDER
      .slice(0, COLUMNS_WITH_WIDTH_AND_EXPANDER.length - 1),
    {
      header: '',
      id: 'hiddenExpander',
      enableSorting: false,
      cell: () => <div>&nbsp;</div>
    }
  ];

  return (
    <SubComponentTr>
      <TableWrapperTd colSpan={COLUMNS_WITH_WIDTH_AND_EXPANDER.length} className="table-wrapper-td">
        <TableComponent
          columns={subColumns}
          data={nestedData}
          renderRowSubComponent={renderRowSubComponent}
          hideHeaders
        />
      </TableWrapperTd>
    </SubComponentTr>
  );
};

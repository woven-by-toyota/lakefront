import { ComponentPropsWithoutRef, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';
import Button from 'src/components/Button/Button';
import TableComponent, { TableProps } from 'src/components/Table';
import DocBlock from '.storybook/DocBlock';
import styled from '@emotion/styled';
import { ReactComponent as ChevronUp } from 'src/components/Collapsible/assets/chevron-up.svg';
import { ReactComponent as ChevronDown } from 'src/components/Collapsible/assets/chevron-down.svg';
import lakefrontColors from 'src/styles/lakefrontColors';

export default {
  title: 'Lakefront/Table',
  component: TableComponent,
  parameters: {
    docs: {
      page: DocBlock
    }
  }
} as Meta;

const columns = [
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

const columnsWithWidth = [
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

const ChevronContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  svg: {
    stroke: lakefrontColors.black
  }
});

const columnsWithWidthAndExpander = [
  ...columnsWithWidth,
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

const CUSTOM_DATA = [{
  title: 'r2204_1_0',
  value: 24,
  percentage: 166.992,
  percentage_change: 6.9579999999,
  total: 0.14371985
},
  { title: 'r2002_1_0', value: 3, percentage: 47.442, percentage_change: 15.814, total: 0.063491 },
  { title: 'r2010_1_0', value: 5, percentage: 25.68, percentage_change: 5.136, total: 0.1947675 },
  { title: 'r2019_1_0', value: 51, percentage: 291.549, percentage_change: 5.7166473529, total: 0.1959277202 },
  { title: 'r2125_1_0', value: 39, percentage: 175.199, percentage_change: 4.4922282052, total: 0.2226686241 },
  { title: 'r2018_1_0', value: 12, percentage: 80.672, percentage_change: 6.7266666, total: 0.148750612 },
  { title: 'r2027_1_0', value: 83, percentage: 275.087, percentage_change: 3.314819277, total: 0.3017716 },
  { title: 'r2016_1_0', value: 27, percentage: 130.419, percentage_change: 4.830333334, total: 0.20705373 },
  { title: 'r2115_1_0', value: 18, percentage: 97.505, percentage_change: 5.7166473529, total: 0.1746059897 },
  { title: 'r1112_1_0', value: 22, percentage: 113.747, percentage_change: 5.7166473529, total: 0.193415712 },
  { title: 'r2110_1_0', value: 80, percentage: 304.77, percentage_change: 3.80969996, total: 0.2625626 }];

const INITIAL_SORT_BY_DATA = [
  { title: 'car', value: 24, percentage: 166.992, percentage_change: 6.9579999999, total: 0.14371985 },
  { title: 'truck', value: 22, percentage: 304.77, percentage_change: 15.814, total: 0.063491 },
  { title: 'boat', value: 5, percentage: 25.68, percentage_change: 5.136, total: 0.1947675 },
  { title: 'car', value: 51, percentage: 291.549, percentage_change: 5.7166473529, total: 0.1959277202 },
  { title: 'boat', value: 51, percentage: 175.199, percentage_change: 4.4922282052, total: 0.2226686241 },
  { title: 'car', value: 12, percentage: 80.672, percentage_change: 6.7266666, total: 0.148750612 },
  { title: 'truck', value: 83, percentage: 275.087, percentage_change: 3.314819277, total: 0.3017716 },
  { title: 'truck', value: 51, percentage: 130.419, percentage_change: 4.830333334, total: 0.20705373 },
  { title: 'truck', value: 18, percentage: 97.505, percentage_change: 5.7166473529, total: 0.1746059897 },
  { title: 'car', value: 22, percentage: 113.747, percentage_change: 5.7166473529, total: 0.193415712 },
  { title: 'boat', value: 22, percentage: 47.442, percentage_change: 3.80969996, total: 0.2625626 }
];

const INFINITE_SCROLL_DATA = [
  ...CUSTOM_DATA,
  ...Array.from({ length: 50 }, (_, index) => ({
    title: `r${index + 1}02_1_0`,
    value: Math.floor(Math.random() * 100),
    percentage: parseFloat((Math.random() * 300).toFixed(3)),
    percentage_change: parseFloat((Math.random() * 20).toFixed(6)),
    total: parseFloat((Math.random()).toFixed(8))
  }))
];

const SubComponentTr = styled.tr({
  'td.table-wrapper-td': {
    padding: 0
  },
  boxShadow: '0px 4px 4px #F5F5F5'
});

const TableWrapperTd = styled.td({
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

const renderRowSubComponent = ({ row }) => {
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
    ...columnsWithWidthAndExpander
      .slice(0, columnsWithWidthAndExpander.length - 1),
    {
      header: '',
      id: 'hiddenExpander',
      enableSorting: false,
      cell: () => <div>&nbsp;</div>
    }
  ];

  return (
    <SubComponentTr>
      <TableWrapperTd colSpan={columnsWithWidthAndExpander.length} className="table-wrapper-td">
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

const StyledTableComponent = styled(TableComponent)({
  td: {
    fontWeight: 'bold'
  },
  table: {
    td: {
      fontWeight: 'normal'
    }
  }
});

const Template: StoryFn<TableProps & ComponentPropsWithoutRef<'div'>> = (args) => {
  const [data, setData] = useState(args.data);
  const [dataToggle, setDataToggle] = useState(false);
  const [sortMsg, setSortMsg] = useState('');

  const resetData = () => {
    const newData = dataToggle ? CUSTOM_DATA : [];
    setData(newData);
    setDataToggle(dataToggle => !dataToggle);
  };

  const handleSort = (_, sortedBy) => {
    const newMsg = 'Sorting is applied on column name(s): ';
    const columnNamesAndSortDirection = sortedBy.map((sortedColumn) => {
      const colName = columns.find(col => col.accessorKey === sortedColumn.id)?.header || sortedColumn.id;
      const sortDirection = sortedColumn.desc ? '(Descending Order)' : '(Ascending Order)';
      return ` ${colName} ${sortDirection}`;
    });

    setSortMsg(`${newMsg} ${columnNamesAndSortDirection}`);
  };

  const RenderTableComponent = args.renderRowSubComponent ? StyledTableComponent : TableComponent;

  return (
    <>
      <div style={{ marginTop: 10, marginLeft: 10 }}>
        <Button color="secondary" onClick={resetData}>
          {dataToggle ? 'Load Data' : 'Clear Data'}</Button><br /><br />
        {!dataToggle && <b>{sortMsg}</b>
        }
      </div>
      <RenderTableComponent {...args} data={data} onChangeSort={handleSort} />
    </>
  );
};

// initialSortBy one column
export const Table = Template.bind({});
Table.args = {
  columns: columns,
  data: CUSTOM_DATA,
  initialSortBy: { id: 'title', desc: false },
  noDataMessage: 'No data found',
  options: {
    disableSortRemove: true,
    autoResetSortBy: true,
    disableMultiSort: false
  }
};


// initialSortBy array of which columns to sort in order
export const TableWithInitialSortByArray = Template.bind({});
TableWithInitialSortByArray.args = {
  columns: columns,
  data: INITIAL_SORT_BY_DATA,
  initialSortBy: [
    { id: 'value', desc: false },
    { id: 'title', desc: true },
    { id: 'percentage', desc: true }
  ],
  noDataMessage: 'No data found',
  options: {
    disableSortRemove: true,
    autoResetSortBy: true,
    disableMultiSort: false
  }
};

export const TableWithMultiSortDisabled = Template.bind({});
TableWithMultiSortDisabled.args = {
  columns: columns,
  data: CUSTOM_DATA,
  initialSortBy: { id: 'title', desc: false },
  noDataMessage: 'No data found',
  options: {
    disableMultiSort: true
  }
};

export const TableWithCustomWidth = Template.bind({});
TableWithCustomWidth.args = {
  columns: columnsWithWidth,
  data: CUSTOM_DATA,
  initialSortBy: { id: 'title', desc: false },
  noDataMessage: 'No data found',
  options: {
    disableMultiSort: false
  }
};

export const TableWithExpandableRows = Template.bind({});
TableWithExpandableRows.args = {
  columns: columnsWithWidthAndExpander,
  data: INITIAL_SORT_BY_DATA,
  noDataMessage: 'No data found',
  renderRowSubComponent
};

const InfiniteScrollTemplate: StoryFn<TableProps & { storyTitle?: string; storyDescription?: string; }> = (args) => {
  const [data, setData] = useState(INFINITE_SCROLL_DATA.slice(0, 5));
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const nextPageData = INFINITE_SCROLL_DATA.slice(page * 5, (page + 1) * 5);

    if (nextPageData.length > 0) {
      setData(prevData => [...prevData, ...nextPageData]);
      setPage(prevPage => prevPage + 1);
    }

    // Check if we've loaded all data
    if ((page + 1) * 5 >= INFINITE_SCROLL_DATA.length) {
      setHasMore(false);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ height: 400 }}>
      <h2>{args.storyTitle || ''}</h2>
      <p>{args.storyDescription || ''}</p>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <div style={{ position: 'relative' }}>
          <TableComponent
            {...args}
            data={data}
            infiniteScroll={{
              onLoadMore: loadMore,
              isLoading,
              hasMore,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const TableWithInfiniteScroll = InfiniteScrollTemplate.bind({});
TableWithInfiniteScroll.args = {
  columns: columns,
  noDataMessage: 'No data found',
  // story props
  storyTitle: 'Table with Infinite Scroll',
  storyDescription: 'Scroll down to load more data.'
};

const StickyHeadersTemplate: StoryFn<TableProps & { storyTitle?: string; storyDescription?: string; }> = (args) => {
  return (
    <div style={{ height: 300, overflow: 'auto' }}>
      <h2>{args.storyTitle || ''}</h2>
      <p>{args.storyDescription || ''}</p>
      <TableComponent {...args} />
    </div>
  );
};

export const TableWithStickyHeaders = StickyHeadersTemplate.bind({});
TableWithStickyHeaders.args = {
  columns: columns,
  data: CUSTOM_DATA,
  stickyHeaders: true,
  noDataMessage: 'No data found',
  // story props
  storyTitle: 'Table with Sticky Headers',
  storyDescription: 'Scroll down to see more data. Table headers will stick to the top.'
};

export const TableWithInfiniteScrollNoStickyHeaders = InfiniteScrollTemplate.bind({});
TableWithInfiniteScrollNoStickyHeaders.args = {
  columns: columns,
  noDataMessage: 'No data found',
  stickyHeaders: false,
  // story props
  storyTitle: 'Table with Infinite Scroll and No Sticky Headers',
  storyDescription: 'Scroll down to load more data. Table headers will not stick to the top.'
};

export const TableWithSettings = InfiniteScrollTemplate.bind({});
TableWithSettings.args = {
  columns: columns,
  data: CUSTOM_DATA,
  tableSettings: {
    columnConfig: {
      enableColumnHiding: true
    }
  } as TableProps['tableSettings'],
  noDataMessage: 'No data found',
  // story props
  storyTitle: 'Table with Settings',
  storyDescription: 'Click the settings icon in the top-left corner to show/hide columns.'
};

export const TableWithSettingsAndMoreActions = InfiniteScrollTemplate.bind({});
TableWithSettingsAndMoreActions.args = {
  columns: columns,
  data: CUSTOM_DATA,
  stickyHeaders: true,
  tableSettings: {
    columnConfig: {
      enableColumnHiding: true
    }
  } as TableProps['tableSettings'],
  moreActionsConfig: {
    getRowActionItems: (row) => [
      {
        label: 'Edit',
        onClick: () => alert(`Edit row: ${row.original.title}`)
      },
      {
        label: 'Delete',
        onClick: () => alert(`Delete row: ${row.original.title}`)
      }
    ]
  },
  noDataMessage: 'No data found',
  // story props
  storyTitle: 'Table with Settings and More Actions',
  storyDescription: 'Click the ellipsis at the far right to reveal row actions.'
};


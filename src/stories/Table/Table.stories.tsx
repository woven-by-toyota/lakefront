import { ComponentPropsWithoutRef, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';
import Button from 'src/components/Button/Button';
import TableComponent, { TableProps } from 'src/components/Table';
import DocBlock from '.storybook/DocBlock';
import { CUSTOM_DATA, EXPORT_DATA, FAULTY_DATA, GROUPED_ROWS_DATA, INFINITE_SCROLL_DATA, INITIAL_SORT_BY_DATA } from './tableStoryData';
import {
  COLUMNS,
  COLUMNS_WITH_WIDTH,
  COLUMNS_WITH_WIDTH_AND_EXPANDER,
  COLUMNS_WITH_RESIZING,
  FAULTY_COLUMNS,
  EXPORT_COLUMNS,
  GROUPED_ROWS_COLUMNS,
  renderRowSubComponent,
} from './tableStoryUtil';
import { StyledTableComponent } from './tableStoryStyles';

interface StoryInfo {
  storyTitle?: string;
  storyDescription?: string;
}

export default {
  title: 'Lakefront/Table',
  component: TableComponent,
  parameters: {
    docs: {
      page: DocBlock
    }
  }
} as Meta;

const Template: StoryFn<TableProps & ComponentPropsWithoutRef<'div'> & StoryInfo> = (args) => {
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
      const colName = COLUMNS.find(col => col.accessorKey === sortedColumn.id)?.header || sortedColumn.id;
      const sortDirection = sortedColumn.desc ? '(Descending Order)' : '(Ascending Order)';
      return ` ${colName} ${sortDirection}`;
    });

    setSortMsg(`${newMsg} ${columnNamesAndSortDirection}`);
  };

  const RenderTableComponent = args.renderRowSubComponent ? StyledTableComponent : TableComponent;

  return (
    <>
      <div style={{ marginTop: 10, marginLeft: 10 }}>
        <h2>{args.storyTitle || ''}</h2>
        <p>{args.storyDescription || ''}</p>
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
  columns: COLUMNS,
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
  columns: COLUMNS,
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
  columns: COLUMNS,
  data: CUSTOM_DATA,
  initialSortBy: { id: 'title', desc: false },
  noDataMessage: 'No data found',
  options: {
    disableMultiSort: true
  }
};

export const TableWithCustomWidth = Template.bind({});
TableWithCustomWidth.args = {
  columns: COLUMNS_WITH_WIDTH,
  data: CUSTOM_DATA,
  initialSortBy: { id: 'title', desc: false },
  noDataMessage: 'No data found',
  options: {
    disableMultiSort: false
  }
};

export const TableWithExpandableRows = Template.bind({});
TableWithExpandableRows.args = {
  columns: COLUMNS_WITH_WIDTH_AND_EXPANDER,
  data: INITIAL_SORT_BY_DATA,
  noDataMessage: 'No data found',
  renderRowSubComponent
};

const InfiniteScrollTemplate: StoryFn<TableProps & StoryInfo> = (args) => {
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
  columns: COLUMNS,
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
  columns: COLUMNS,
  data: CUSTOM_DATA,
  stickyHeaders: true,
  noDataMessage: 'No data found',
  // story props
  storyTitle: 'Table with Sticky Headers',
  storyDescription: 'Scroll down to see more data. Table headers will stick to the top.'
};

export const TableWithInfiniteScrollNoStickyHeaders = InfiniteScrollTemplate.bind({});
TableWithInfiniteScrollNoStickyHeaders.args = {
  columns: COLUMNS,
  noDataMessage: 'No data found',
  stickyHeaders: false,
  // story props
  storyTitle: 'Table with Infinite Scroll and No Sticky Headers',
  storyDescription: 'Scroll down to load more data. Table headers will not stick to the top.'
};

export const TableWithSettings = InfiniteScrollTemplate.bind({});
TableWithSettings.args = {
  columns: COLUMNS,
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

export const TableWithDownload = Template.bind({});
TableWithDownload.args = {
  columns: EXPORT_COLUMNS,
  data: EXPORT_DATA,
  tableSettings: {
    columnConfig: {
      enableColumnHiding: true
    },
    enableDownload: true,
    downloadFilename: 'my-table-export.csv'
  } as TableProps['tableSettings'],
  noDataMessage: 'No data found',
  // story props
  storyTitle: 'Table with Download',
  storyDescription: 'Click the download icon to export the current table data as CSV. Only visible columns will be included in the export. In this example, the "COMPARE_TOTAL" column demonstrates custom cell rendering and custom CSV export value.'
};

export const TableWithTextButtonStyle = InfiniteScrollTemplate.bind({});
TableWithTextButtonStyle.args = {
  columns: COLUMNS,
  data: CUSTOM_DATA,
  tableSettings: {
    columnConfig: {
      enableColumnHiding: true
    },
    enableDownload: true,
    downloadFilename: 'my-table-export.csv',
    buttonDisplayStyle: 'text'
  } as TableProps['tableSettings'],
  noDataMessage: 'No data found',
  // story props
  storyTitle: 'Table with Text Button Style',
  storyDescription: 'Table settings and download buttons are displayed as text buttons with borders. Hide a column to see the hyperlink color on the Settings button.'
};

export const TableWithSettingsAndMoreActions = InfiniteScrollTemplate.bind({});
TableWithSettingsAndMoreActions.args = {
  columns: COLUMNS,
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

export const TableWithInitialColumnVisibility = InfiniteScrollTemplate.bind({});
TableWithInitialColumnVisibility.args = {
  columns: COLUMNS,
  data: CUSTOM_DATA,
  tableSettings: {
    columnConfig: {
      enableColumnHiding: true,
      initialColumnVisibility: {
        percentage: false,
        percentage_change: false
      }
    },
  } as TableProps['tableSettings'],
  noDataMessage: 'No data found',
  // story props
  storyTitle: 'Table with Initial Column Visibility',
  storyDescription: 'Some columns are hidden by default. Use the settings icon to show/hide columns.'
};

export const TableWithErrorHandling = InfiniteScrollTemplate.bind({});
TableWithErrorHandling.args = {
  columns: FAULTY_COLUMNS,
  data: FAULTY_DATA,
  // story props
  storyTitle: 'Table with Faulty Data and Error Handling',
  storyDescription: 'Incomplete data has been provided to table.'
};

export const TableWithResizableColumns = InfiniteScrollTemplate.bind({});
TableWithResizableColumns.args = {
  columns: COLUMNS_WITH_RESIZING,
  data: CUSTOM_DATA,
  initialSortBy: { id: 'title', desc: false },
  // story props
  storyTitle: 'Table with Resizable Columns',
  storyDescription: 'Drag the edges of the column headers to resize columns. Resize handles are visible on hover or when a column is actively being resized. In this example, all columns except the last one can be resized.'
};

const GroupedRowsTemplate: StoryFn<TableProps & StoryInfo> = (args) => {
  return (
    <>
      <div style={{ marginTop: 10, marginLeft: 10 }}>
        <h2>{args.storyTitle || ''}</h2>
        <p>{args.storyDescription || ''}</p>
      </div>
      <TableComponent {...args} />
    </>
  );
};

export const TableWithGroupedRows = GroupedRowsTemplate.bind({});
TableWithGroupedRows.args = {

  columns: GROUPED_ROWS_COLUMNS,
  data: GROUPED_ROWS_DATA,
  tableSettings: {
    columnConfig: {
      enableColumnHiding: true
    },
    enableDownload: true,
    downloadFilename: 'my-table-export.csv'
  } as TableProps['tableSettings'],
  groupedRows: {
    enabled: true,
    groupBy: 'genre'
  } as TableProps['groupedRows'],
  noDataMessage: 'No data found',
  // story props
  storyTitle: 'Table with Grouped Rows (Excel-style merged cells)',
  storyDescription: 'Genre values are merged in Excel-style with rowspan, showing each genre name only once per group. Each genre (Fiction, Non-Fiction, Science, Biography) shows multiple books underneath with their titles, authors, page counts, and ratings.'
};


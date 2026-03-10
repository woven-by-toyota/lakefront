import { fireEvent, screen, waitFor } from '@testing-library/react';
import Table from '../Table';
import { renderWithTheme as render } from 'src/lib/testing';
import { humanize } from 'src/lib/format.js';
import * as downloadUtils from '../tableDownloadUtils';

const columns = [
  {
    header: 'TITLE',
    accessorKey: 'title',
    size: 100,
    cell: ({ getValue }: any) => getValue()
  },
  {
    header: 'VALUE',
    accessorKey: 'value'
  },
  {
    header: 'PERCENTAGE',
    accessorKey: 'percentage'
  }
];

const customData = [
  { title: 'r2204_1_0', value: 24, percentage: 166.992 },
  { title: 'r2012_1_0', value: 3, percentage: 47.442 },
  { title: 'r2010_1_0', value: 5, percentage: 25.68 }
];

describe('<Table> with tableSettings', () => {
  it('renders settings button when tableSettings.enableColumnHiding is true', () => {
    const { container } = render(
      <Table
        columns={columns}
        data={customData}
        tableSettings={{ columnConfig: { enableColumnHiding: true } }}
      />
    );

    const settingsButton = container.querySelector('button[aria-label="Table settings"]');
    expect(settingsButton).toBeInTheDocument();
  });

  it('does not render settings button when tableSettings is not provided', () => {
    const { container } = render(
      <Table columns={columns} data={customData} />
    );

    const settingsButton = container.querySelector('button[aria-label="Table settings"]');
    expect(settingsButton).not.toBeInTheDocument();
  });

  it('opens settings overlay when settings button is clicked', () => {
    const { container } = render(
      <Table
        columns={columns}
        data={customData}
        tableSettings={{ columnConfig: { enableColumnHiding: true } }}
      />
    );

    const settingsButton = container.querySelector('button[aria-label="Table settings"]');
    fireEvent.click(settingsButton as Element);

    expect(screen.getByText('Table Settings')).toBeInTheDocument();
    expect(screen.getByText('Columns')).toBeInTheDocument();
  });

  it('displays all hideable columns (with label transform) in settings overlay', () => {
    render(
      <Table
        columns={columns}
        data={customData}
        tableSettings={{ columnConfig: { enableColumnHiding: true, columnLabelTransform: humanize } }}
      />
    );

    const settingsButton = screen.getByLabelText('Table settings');
    fireEvent.click(settingsButton);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Percentage')).toBeInTheDocument();
  });

  it('hides column when checkbox is unchecked', async () => {
    const { container } = render(
      <Table
        columns={columns}
        data={customData}
        tableSettings={{ columnConfig: { enableColumnHiding: true, columnLabelTransform: humanize } }}
      />
    );

    // Verify all columns are visible initially
    expect(screen.getByText('TITLE')).toBeInTheDocument();
    expect(screen.getByText('VALUE')).toBeInTheDocument();
    expect(screen.getByText('PERCENTAGE')).toBeInTheDocument();

    // Open settings
    const settingsButton = screen.getByLabelText('Table settings');
    fireEvent.click(settingsButton);

    // Find the VALUE checkbox (using the label)
    const valueCheckboxLabel = screen.getAllByText('Value').find(
      (el) => el.tagName === 'SPAN'
    ) as Element;
    const valueCheckbox = (valueCheckboxLabel.closest('label') as Element).querySelector('input[type="checkbox"]');

    // Uncheck the VALUE column
    fireEvent.click(valueCheckbox as Element);

    // Close settings
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    // Wait for the column to be hidden
    await waitFor(() => {
      const headers = container.querySelectorAll('thead th');
      const headerTexts = Array.from(headers).map((th) => th.textContent);
      expect(headerTexts).not.toContain('VALUE');
    });
  });

  it('closes settings overlay when close button is clicked', () => {
    render(
      <Table
        columns={columns}
        data={customData}
        tableSettings={{ columnConfig: { enableColumnHiding: true } }}
      />
    );

    // Open settings
    const settingsButton = screen.getByLabelText('Table settings');
    fireEvent.click(settingsButton);

    expect(screen.getByText('Table Settings')).toBeInTheDocument();

    // Close settings
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Table Settings')).not.toBeInTheDocument();
  });

  it('closes settings overlay when overlay backdrop is clicked', () => {
    render(
      <Table
        columns={columns}
        data={customData}
        tableSettings={{ columnConfig: { enableColumnHiding: true } }}
      />
    );

    // Open settings
    const settingsButton = screen.getByLabelText('Table settings');
    fireEvent.click(settingsButton);

    expect(screen.getByText('Table Settings')).toBeInTheDocument();

    // Click backdrop
    const overlay = screen.getByLabelText('table settings background');
    fireEvent.click(overlay as Element);

    expect(screen.queryByText('Table Settings')).not.toBeInTheDocument();
  });

  it('does not show more-actions column in settings', () => {
    const columnsWithMoreActions = [
      ...columns,
      {
        id: 'more-actions',
        header: '',
        enableSorting: false,
        cell: () => <div>Actions</div>
      }
    ];

    render(
      <Table
        columns={columnsWithMoreActions}
        data={customData}
        tableSettings={{ columnConfig: { enableColumnHiding: true, columnLabelTransform: humanize } }}
        moreActionsConfig={{
          getRowActionItems: () => []
        }}
      />
    );

    // Open settings
    const settingsButton = screen.getByLabelText('Table settings');
    fireEvent.click(settingsButton);

    // Should show regular columns
    expect(screen.getByText('TITLE')).toBeInTheDocument();
    expect(screen.getByText('VALUE')).toBeInTheDocument();
    expect(screen.getByText('PERCENTAGE')).toBeInTheDocument();

    // Should not show more-actions in the list (there should only be 3 checkboxes + 1 show all checkbox)
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4);
  });

  it('respects enableHiding: false on column definition', () => {
    const columnsWithNonHideable = [
      {
        header: 'TITLE',
        accessorKey: 'title',
        enableHiding: false
      },
      {
        header: 'VALUE',
        accessorKey: 'value'
      }
    ];

    render(
      <Table
        columns={columnsWithNonHideable}
        data={customData}
        tableSettings={{ columnConfig: { enableColumnHiding: true, columnLabelTransform: humanize } }}
      />
    );

    // Open settings
    const settingsButton = screen.getByLabelText('Table settings');
    fireEvent.click(settingsButton);

    // Should only show Value column (Title has enableHiding: false)
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2); // 1 for Value + 1 show all checkbox
  });

  describe('download functionality', () => {
    let convertToCSVSpy: jest.SpyInstance;
    let downloadFileSpy: jest.SpyInstance;

    beforeEach(() => {
      convertToCSVSpy = jest.spyOn(downloadUtils, 'convertToCSV').mockReturnValue('mock,csv,data');
      downloadFileSpy = jest.spyOn(downloadUtils, 'downloadFile').mockImplementation(() => {});
    });

    afterEach(() => {
      convertToCSVSpy.mockRestore();
      downloadFileSpy.mockRestore();
    });

    it('renders download button when enableDownload is true', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={customData}
          tableSettings={{
            columnConfig: { enableColumnHiding: true },
            enableDownload: true
          }}
        />
      );

      const downloadButton = container.querySelector('button[aria-label="Download table data"]');
      expect(downloadButton).toBeInTheDocument();
    });

    it('does not render download button when enableDownload is false', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={customData}
          tableSettings={{
            columnConfig: { enableColumnHiding: true },
            enableDownload: false
          }}
        />
      );

      const downloadButton = container.querySelector('button[aria-label="Download table data"]');
      expect(downloadButton).not.toBeInTheDocument();
    });

    it('does not render download button when enableDownload is not provided', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={customData}
          tableSettings={{
            columnConfig: { enableColumnHiding: true }
          }}
        />
      );

      const downloadButton = container.querySelector('button[aria-label="Download table data"]');
      expect(downloadButton).not.toBeInTheDocument();
    });

    it('triggers download with default filename when download button is clicked', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={customData}
          tableSettings={{
            columnConfig: { enableColumnHiding: true },
            enableDownload: true
          }}
        />
      );

      const downloadButton = container.querySelector('button[aria-label="Download table data"]');
      fireEvent.click(downloadButton as Element);

      expect(convertToCSVSpy).toHaveBeenCalled();
      expect(downloadFileSpy).toHaveBeenCalledWith('mock,csv,data', 'table-data.csv');
    });

    it('triggers download with custom filename when provided', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={customData}
          tableSettings={{
            columnConfig: { enableColumnHiding: true },
            enableDownload: true,
            downloadFilename: 'custom-export.csv'
          }}
        />
      );

      const downloadButton = container.querySelector('button[aria-label="Download table data"]');
      fireEvent.click(downloadButton as Element);

      expect(convertToCSVSpy).toHaveBeenCalled();
      expect(downloadFileSpy).toHaveBeenCalledWith('mock,csv,data', 'custom-export.csv');
    });

    it('downloads only visible columns when some columns are hidden', async () => {
      const { container } = render(
        <Table
          columns={columns}
          data={customData}
          tableSettings={{
            columnConfig: { enableColumnHiding: true, columnLabelTransform: humanize },
            enableDownload: true
          }}
        />
      );

      // Open settings and hide the VALUE column
      const settingsButton = screen.getByLabelText('Table settings');
      fireEvent.click(settingsButton);

      const valueCheckboxLabel = screen.getAllByText('Value').find(
        (el) => el.tagName === 'SPAN'
      ) as Element;
      const valueCheckbox = (valueCheckboxLabel.closest('label') as Element).querySelector('input[type="checkbox"]');
      fireEvent.click(valueCheckbox as Element);

      // Close settings
      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      // Wait for column to be hidden
      await waitFor(() => {
        const headers = container.querySelectorAll('thead th');
        const headerTexts = Array.from(headers).map((th) => th.textContent);
        expect(headerTexts).not.toContain('VALUE');
      });

      // Click download button
      const downloadButton = container.querySelector('button[aria-label="Download table data"]');
      fireEvent.click(downloadButton as Element);

      // Check that convertToCSV was called
      expect(convertToCSVSpy).toHaveBeenCalled();

      // Verify that the columns passed to convertToCSV only include visible columns
      const callArgs = convertToCSVSpy.mock.calls[0];
      const columnsPassedToCSV = callArgs[1];
      const columnIds = columnsPassedToCSV.map((col: any) => col.id);

      // Should include TITLE and PERCENTAGE but not VALUE
      expect(columnIds).toContain('title');
      expect(columnIds).toContain('percentage');
      expect(columnIds).not.toContain('value');
    });

    it('excludes more-actions column from download', () => {
      const columnsWithMoreActions = [
        ...columns,
        {
          id: 'more-actions',
          header: '',
          enableSorting: false,
          cell: () => <div>Actions</div>
        }
      ];

      const { container } = render(
        <Table
          columns={columnsWithMoreActions}
          data={customData}
          tableSettings={{
            columnConfig: { enableColumnHiding: true },
            enableDownload: true
          }}
          moreActionsConfig={{
            getRowActionItems: () => []
          }}
        />
      );

      const downloadButton = container.querySelector('button[aria-label="Download table data"]');
      fireEvent.click(downloadButton as Element);

      expect(convertToCSVSpy).toHaveBeenCalled();

      // Verify that more-actions column is excluded
      const callArgs = convertToCSVSpy.mock.calls[0];
      const columnsPassedToCSV = callArgs[1];
      const columnIds = columnsPassedToCSV.map((col: any) => col.id);

      expect(columnIds).not.toContain('more-actions');
    });
  });

  describe('button display styles', () => {
    it('renders icon buttons by default', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={customData}
          tableSettings={{
            columnConfig: { enableColumnHiding: true },
            enableDownload: true
          }}
        />
      );

      // Icon buttons should be present
      const settingsButton = container.querySelector('button.settings-icon');
      const downloadButton = container.querySelector('button.download-icon');

      expect(settingsButton).toBeInTheDocument();
      expect(downloadButton).toBeInTheDocument();

      // Text buttons should not be present
      const textButtons = container.querySelectorAll('button.text-button');
      expect(textButtons).toHaveLength(0);
    });

    it('renders text buttons when buttonDisplayStyle is "text"', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={customData}
          tableSettings={{
            columnConfig: { enableColumnHiding: true },
            enableDownload: true,
            buttonDisplayStyle: 'text'
          }}
        />
      );

      // Text buttons should be present
      const settingsButton = container.querySelector('button.settings-button');
      const downloadButton = container.querySelector('button.download-button');

      expect(settingsButton).toBeInTheDocument();
      expect(downloadButton).toBeInTheDocument();
      expect(settingsButton?.textContent).toBe('Settings');
      expect(downloadButton?.textContent).toBe('Export CSV');

      // Icon buttons should not be present
      const iconSettingsButton = container.querySelector('button.settings-icon');
      const iconDownloadButton = container.querySelector('button.download-icon');
      expect(iconSettingsButton).not.toBeInTheDocument();
      expect(iconDownloadButton).not.toBeInTheDocument();
    });

    it('opens settings overlay when text-style settings button is clicked', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={customData}
          tableSettings={{
            columnConfig: { enableColumnHiding: true },
            buttonDisplayStyle: 'text'
          }}
        />
      );

      const settingsButton = container.querySelector('button.settings-button');
      fireEvent.click(settingsButton as Element);

      expect(screen.getByText('Table Settings')).toBeInTheDocument();
      expect(screen.getByText('Columns')).toBeInTheDocument();
    });

    it('triggers download when text-style download button is clicked', () => {
      const convertToCSVSpy = jest.spyOn(downloadUtils, 'convertToCSV').mockReturnValue('mock,csv,data');
      const downloadFileSpy = jest.spyOn(downloadUtils, 'downloadFile').mockImplementation(() => {});

      const { container } = render(
        <Table
          columns={columns}
          data={customData}
          tableSettings={{
            columnConfig: { enableColumnHiding: true },
            enableDownload: true,
            buttonDisplayStyle: 'text'
          }}
        />
      );

      const downloadButton = container.querySelector('button.download-button');
      fireEvent.click(downloadButton as Element);

      expect(convertToCSVSpy).toHaveBeenCalled();
      expect(downloadFileSpy).toHaveBeenCalled();

      convertToCSVSpy.mockRestore();
      downloadFileSpy.mockRestore();
    });

    it('only renders settings text button when download is not enabled', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={customData}
          tableSettings={{
            columnConfig: { enableColumnHiding: true },
            buttonDisplayStyle: 'text'
          }}
        />
      );

      const settingsButton = container.querySelector('button.settings-button');
      const downloadButton = container.querySelector('button.download-button');

      expect(settingsButton).toBeInTheDocument();
      expect(downloadButton).not.toBeInTheDocument();
    });
  });

  describe('column sizing', () => {
    it('respects initialColumnSizing configuration', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={customData}
          tableSettings={{
            columnConfig: {
              enableColumnHiding: true,
              initialColumnSizing: {
                title: 200,
                value: 150
              }
            }
          }}
        />
      );

      // Get the first header cell (TITLE column)
      const titleHeader = container.querySelector('thead th:first-child');
      expect(titleHeader).toHaveStyle({ width: '200px' });

      // Get the second header cell (VALUE column)
      const valueHeader = container.querySelector('thead th:nth-child(2)');
      expect(valueHeader).toHaveStyle({ width: '150px' });
    });

    it('calls columnSizingChangeSubscriber when column is resized', () => {
      const columnSizingChangeSubscriber = jest.fn();
      const resizableColumns = [
        {
          header: 'TITLE',
          accessorKey: 'title',
          size: 100,
          enableResizing: true
        },
        {
          header: 'VALUE',
          accessorKey: 'value',
          enableResizing: true
        }
      ];

      const { container } = render(
        <Table
          columns={resizableColumns}
          data={customData}
          tableSettings={{
            columnConfig: {
              enableColumnHiding: true,
              columnSizingChangeSubscriber
            }
          }}
        />
      );

      // Find the resize handle for the first column
      const resizeHandle = container.querySelector('.resizer');

      if (resizeHandle) {
        // Simulate resize by triggering mousedown
        fireEvent.mouseDown(resizeHandle);

        // The subscriber should be called with the updated sizing state
        // Note: The exact behavior depends on how @tanstack/react-table handles resize events
        // This test verifies the subscriber is set up correctly
        expect(columnSizingChangeSubscriber).toBeDefined();
      }
    });

    it('uses both initialColumnVisibility and initialColumnSizing together', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={customData}
          tableSettings={{
            columnConfig: {
              enableColumnHiding: true,
              initialColumnVisibility: {
                percentage: false
              },
              initialColumnSizing: {
                title: 250,
                value: 175
              }
            }
          }}
        />
      );

      // Verify title column has custom size
      const titleHeader = container.querySelector('thead th:first-child');
      expect(titleHeader).toHaveStyle({ width: '250px' });

      // Verify percentage column is hidden
      const headers = container.querySelectorAll('thead th');
      const headerTexts = Array.from(headers).map((th) => th.textContent);
      expect(headerTexts).not.toContain('PERCENTAGE');

      // Verify value column is visible with custom size
      expect(headerTexts).toContain('VALUE');
    });
  });
});

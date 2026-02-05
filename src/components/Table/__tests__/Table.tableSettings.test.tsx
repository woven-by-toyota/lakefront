import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Table from '../Table';

const columns = [
  {
    header: 'TITLE',
    accessorKey: 'title',
    size: 100,
    cell: ({ getValue }) => getValue()
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
        tableSettings={{ enableColumnHiding: true }}
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
        tableSettings={{ enableColumnHiding: true }}
      />
    );

    const settingsButton = container.querySelector('button[aria-label="Table settings"]');
    fireEvent.click(settingsButton);

    expect(screen.getByText('Table Settings')).toBeInTheDocument();
    expect(screen.getByText('Show/Hide Columns')).toBeInTheDocument();
  });

  it('displays all hideable columns in settings overlay', () => {
    render(
      <Table
        columns={columns}
        data={customData}
        tableSettings={{ enableColumnHiding: true }}
      />
    );

    const settingsButton = screen.getByLabelText('Table settings');
    fireEvent.click(settingsButton);

    expect(screen.getByText('TITLE')).toBeInTheDocument();
    expect(screen.getByText('VALUE')).toBeInTheDocument();
    expect(screen.getByText('PERCENTAGE')).toBeInTheDocument();
  });

  it('hides column when checkbox is unchecked', async () => {
    const { container } = render(
      <Table
        columns={columns}
        data={customData}
        tableSettings={{ enableColumnHiding: true }}
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
    const valueCheckboxLabel = screen.getAllByText('VALUE').find(
      (el) => el.tagName === 'SPAN'
    );
    const valueCheckbox = valueCheckboxLabel.closest('label').querySelector('input[type="checkbox"]');

    // Uncheck the VALUE column
    fireEvent.click(valueCheckbox);

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
        tableSettings={{ enableColumnHiding: true }}
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
    const { container } = render(
      <Table
        columns={columns}
        data={customData}
        tableSettings={{ enableColumnHiding: true }}
      />
    );

    // Open settings
    const settingsButton = screen.getByLabelText('Table settings');
    fireEvent.click(settingsButton);

    expect(screen.getByText('Table Settings')).toBeInTheDocument();

    // Click backdrop
    const overlay = container.querySelector('[style*="position: fixed"]');
    fireEvent.click(overlay);

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
        tableSettings={{ enableColumnHiding: true }}
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

    // Should not show more-actions in the list (there should only be 3 checkboxes)
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
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
        tableSettings={{ enableColumnHiding: true }}
      />
    );

    // Open settings
    const settingsButton = screen.getByLabelText('Table settings');
    fireEvent.click(settingsButton);

    // Should only show VALUE column (TITLE has enableHiding: false)
    expect(screen.queryByText('TITLE')).not.toBeInTheDocument();
    expect(screen.getByText('VALUE')).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(1);
  });
});

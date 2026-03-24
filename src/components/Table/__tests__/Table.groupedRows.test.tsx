import Table from '../Table';
import { renderWithTheme } from '../../../lib/testing';

const mockData = [
  { platform: 'TMPOC', region: 'US', total: 7, online: 0, offline: 7 },
  { platform: 'TMPOC', region: 'JP', total: 3, online: 0, offline: 3 },
  { platform: 'TMPOC Lite', region: 'US', total: 7, online: 0, offline: 7 },
  { platform: 'TMPOC Lite', region: 'JP', total: 3, online: 0, offline: 3 },
];

const mockColumns = [
  { header: 'Platform', accessorKey: 'platform' },
  { header: 'Region', accessorKey: 'region' },
  { header: 'Total', accessorKey: 'total' },
  { header: 'Online', accessorKey: 'online' },
  { header: 'Offline', accessorKey: 'offline' },
];

describe('Table with Grouped Rows', () => {
  it('renders grouped rows when groupedRows is enabled', () => {
    const {getByText, getAllByText} = renderWithTheme(
      <Table
        data={mockData}
        columns={mockColumns}
        groupedRows={{
          enabled: true,
          groupBy: 'platform'
        }}
      />
    );

    expect(getByText('TMPOC')).toBeInTheDocument();
    expect(getByText('TMPOC Lite')).toBeInTheDocument();
    expect(getAllByText('US')).toHaveLength(2);
    expect(getAllByText('JP')).toHaveLength(2);
  });

  it('renders normal table when groupedRows is disabled', () => {
    const {getAllByText} = renderWithTheme(
      <Table
        data={mockData}
        columns={mockColumns}
        groupedRows={{
          enabled: false,
          groupBy: 'platform'
        }}
      />
    );

    const tmpocCells = getAllByText('TMPOC');
    expect(tmpocCells).toHaveLength(2);
  });

  it('renders grouped rows with Excel-style merged cells', () => {
    const {getByText, getAllByText} = renderWithTheme(
      <Table
        data={mockData}
        columns={mockColumns}
        groupedRows={{
          enabled: true,
          groupBy: 'platform'
        }}
      />
    );

    expect(getByText('TMPOC')).toBeInTheDocument();
    expect(getByText('TMPOC Lite')).toBeInTheDocument();
    expect(getAllByText('US')).toHaveLength(2);
    expect(getAllByText('JP')).toHaveLength(2);
  });

  it('renders normal table when groupedRows is not provided', () => {
    const {getAllByText} = renderWithTheme(
      <Table
        data={mockData}
        columns={mockColumns}
      />
    );

    const tmpocCells = getAllByText('TMPOC');
    expect(tmpocCells).toHaveLength(2);

    const tmpocLiteCells = getAllByText('TMPOC Lite');
    expect(tmpocLiteCells).toHaveLength(2);
  });
});
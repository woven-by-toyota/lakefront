import React from 'react';
import { render, screen } from '@testing-library/react';
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
    renderWithTheme(
      <Table
        data={mockData}
        columns={mockColumns}
        groupedRows={{
          enabled: true,
          groupBy: 'platform'
        }}
      />
    );

    // Check that platform values are shown (should be fewer due to grouping)
    expect(screen.getByText('TMPOC')).toBeInTheDocument();
    expect(screen.getByText('TMPOC Lite')).toBeInTheDocument();

    // Check that data rows are still rendered
    expect(screen.getAllByText('US')).toHaveLength(2);
    expect(screen.getAllByText('JP')).toHaveLength(2);
  });

  it('renders normal table when groupedRows is disabled', () => {
    renderWithTheme(
      <Table
        data={mockData}
        columns={mockColumns}
        groupedRows={{
          enabled: false,
          groupBy: 'platform'
        }}
      />
    );

    // Should render platform values as regular cells, not grouped
    const tmpocCells = screen.getAllByText('TMPOC');
    expect(tmpocCells).toHaveLength(2); // Two rows with TMPOC platform
  });

  it('renders grouped rows with Excel-style merged cells', () => {
    renderWithTheme(
      <Table
        data={mockData}
        columns={mockColumns}
        groupedRows={{
          enabled: true,
          groupBy: 'platform'
        }}
      />
    );

    // Check that platform grouping is working with Excel-style merging
    expect(screen.getByText('TMPOC')).toBeInTheDocument();
    expect(screen.getByText('TMPOC Lite')).toBeInTheDocument();

    // Regions should still be visible
    expect(screen.getAllByText('US')).toHaveLength(2);
    expect(screen.getAllByText('JP')).toHaveLength(2);
  });

  it('renders normal table when groupedRows is not provided', () => {
    renderWithTheme(
      <Table
        data={mockData}
        columns={mockColumns}
      />
    );

    // Should render all platform values as regular cells
    const tmpocCells = screen.getAllByText('TMPOC');
    expect(tmpocCells).toHaveLength(2);

    const tmpocLiteCells = screen.getAllByText('TMPOC Lite');
    expect(tmpocLiteCells).toHaveLength(2);
  });
});
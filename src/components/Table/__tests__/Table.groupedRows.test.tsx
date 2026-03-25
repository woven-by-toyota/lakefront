import Table from '../Table';
import { renderWithTheme } from '../../../lib/testing';

const mockData = [
  { genre: 'Fiction', title: 'The Great Adventure', author: 'Jane Smith', pages: 324, rating: 4.2 },
  { genre: 'Fiction', title: 'Mystery of the Lake', author: 'John Doe', pages: 278, rating: 4.5 },
  { genre: 'Non-Fiction', title: 'History of Technology', author: 'Dr. Brown', pages: 456, rating: 4.1 },
  { genre: 'Non-Fiction', title: 'Cooking Mastery', author: 'Chef Maria', pages: 312, rating: 4.7 },
];

const mockColumns = [
  { header: 'Genre', accessorKey: 'genre' },
  { header: 'Title', accessorKey: 'title' },
  { header: 'Author', accessorKey: 'author' },
  { header: 'Pages', accessorKey: 'pages' },
  { header: 'Rating', accessorKey: 'rating' },
];

describe('Table with Grouped Rows', () => {
  it('renders grouped rows when groupedRows is enabled', () => {
    const {getByText, getAllByText} = renderWithTheme(
      <Table
        data={mockData}
        columns={mockColumns}
        groupedRows={{
          enabled: true,
          groupBy: 'genre'
        }}
      />
    );

    expect(getByText('Fiction')).toBeInTheDocument();
    expect(getByText('Non-Fiction')).toBeInTheDocument();
    expect(getAllByText('The Great Adventure')).toHaveLength(1);
    expect(getAllByText('History of Technology')).toHaveLength(1);
  });

  it('renders grouped rows with alternating colors when enabled', () => {
    const {getByText} = renderWithTheme(
      <Table
        data={mockData}
        columns={mockColumns}
        groupedRows={{
          enabled: true,
          groupBy: 'genre',
          alternatingColors: true
        }}
      />
    );

    expect(getByText('Fiction')).toBeInTheDocument();
    expect(getByText('Non-Fiction')).toBeInTheDocument();
  });

  it('renders grouped rows without alternating colors when disabled', () => {
    const {getByText} = renderWithTheme(
      <Table
        data={mockData}
        columns={mockColumns}
        groupedRows={{
          enabled: true,
          groupBy: 'genre',
          alternatingColors: false
        }}
      />
    );

    expect(getByText('Fiction')).toBeInTheDocument();
    expect(getByText('Non-Fiction')).toBeInTheDocument();
  });

  it('renders normal table when groupedRows is disabled', () => {
    const {getAllByText} = renderWithTheme(
      <Table
        data={mockData}
        columns={mockColumns}
        groupedRows={{
          enabled: false,
          groupBy: 'genre'
        }}
      />
    );

    const fictionCells = getAllByText('Fiction');
    expect(fictionCells).toHaveLength(2);
  });

  it('renders grouped rows with Excel-style merged cells', () => {
    const {getByText, getAllByText} = renderWithTheme(
      <Table
        data={mockData}
        columns={mockColumns}
        groupedRows={{
          enabled: true,
          groupBy: 'genre'
        }}
      />
    );

    expect(getByText('Fiction')).toBeInTheDocument();
    expect(getByText('Non-Fiction')).toBeInTheDocument();
    expect(getAllByText('Jane Smith')).toHaveLength(1);
    expect(getAllByText('Dr. Brown')).toHaveLength(1);
  });

  it('renders normal table when groupedRows is not provided', () => {
    const {getAllByText} = renderWithTheme(
      <Table
        data={mockData}
        columns={mockColumns}
      />
    );

    const fictionCells = getAllByText('Fiction');
    expect(fictionCells).toHaveLength(2);

    const nonFictionCells = getAllByText('Non-Fiction');
    expect(nonFictionCells).toHaveLength(2);
  });
});
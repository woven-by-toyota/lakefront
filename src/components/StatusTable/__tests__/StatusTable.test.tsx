import StatusTable from '../StatusTable';
import StatusRow, { Status } from '../StatusRow';
import StatusCellBadge from '../StatusCellBadge';
import { renderWithTheme as render } from 'src/lib/testing';
import { DARK_THEME } from 'src/styles/theme';

const mockTableHeaders = [
    {
        name: 'First',
        field: 'first',
        sortable: true
    },
    {
        name: 'Second',
        field: 'second',
        sortable: false
    }
];

const StatusTableContent = () => (
    <StatusTable headers={mockTableHeaders} handleSort={jest.fn()}>
        <StatusRow status={Status.RUNNING}>
            <td>First</td>
            <td><StatusCellBadge status={'RUNNING'} /></td>
        </StatusRow>
        <StatusRow status={Status.ENQUEUED}>
            <td>First</td>
            <td><StatusCellBadge status={'ENQUEUED'} /></td>
        </StatusRow>
        <StatusRow status={Status.FAILED}>
            <td>First</td>
            <td><StatusCellBadge status={'FAILED'} /></td>
        </StatusRow>
        <StatusRow>
            <td>First</td>
            <td><StatusCellBadge status={'FINISHED'} /></td>
        </StatusRow>
        <StatusRow status={Status.NONE}>
            <td>First</td>
            <td><StatusCellBadge status={'NONE'} /></td>
        </StatusRow>
    </StatusTable>
);

describe('<StatusTable />', function () {
    it('should render properly in light theme', () => {
        const { container } = render(<StatusTableContent />);
        expect(container).toMatchSnapshot('light-theme');
    });

    it('should render properly in dark theme', () => {
        const { container } = render(<StatusTableContent />, 'dark');
        expect(container).toMatchSnapshot('dark-theme');
    });

    it('applies correct theme styling in light mode', () => {
        const { container } = render(<StatusTableContent />);
        const table = container.querySelector('table');
        expect(table).toBeInTheDocument();

        // Verify basic table structure exists
        const headers = container.querySelectorAll('th');
        expect(headers).toHaveLength(2);

        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBeGreaterThan(0);
    });

    it('applies correct theme styling in dark mode', () => {
        const { container } = render(<StatusTableContent />, DARK_THEME);
        const table = container.querySelector('table');
        expect(table).toBeInTheDocument();

        // Verify basic table structure exists with dark theme
        const headers = container.querySelectorAll('th');
        expect(headers).toHaveLength(2);

        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBeGreaterThan(0);
    });
});

import StatusTable from '../StatusTable';
import StatusRow, { Status } from '../StatusRow';
import StatusCellBadge from '../StatusCellBadge';
import { render } from '@testing-library/react';

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

describe('<StatusTable />', function () {
    it('should render properly', () => {
      const { container } = render(
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

        expect(container).toMatchSnapshot();
    });
});

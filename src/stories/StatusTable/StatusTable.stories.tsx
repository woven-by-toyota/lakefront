import type { ComponentPropsWithoutRef } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';

import { StatusTable as StatusTableComponent, StatusRow, StatusCellBadge, type StatusTableProps, Status } from 'src/components/StatusTable';
import DocBlock from '.storybook/DocBlock';

export default {
    title: 'Lakefront/StatusTable',
    component: StatusTableComponent,
    argTypes: {
        children: {
            table: {
                disable: true
            }
        },
        className: {
            type: 'string'
        }
    },
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<StatusTableProps & ComponentPropsWithoutRef<'div'>> = (args) => {

    return (
        <StatusTableComponent headers={args.headers} cards={args.cards}>
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
            <StatusRow >
                <td>First</td>
                <td><StatusCellBadge status={'FINISHED'} /></td>
            </StatusRow>
            <StatusRow status={Status.NONE}>
                <td>First</td>
                <td><StatusCellBadge status={'NONE'} /></td>
            </StatusRow>
        </StatusTableComponent>
    );
};

export const StatusTable = Template.bind({});
StatusTable.args = {
    headers: [{
        name: 'FIRST',
        field: 'first',
        sortable: true
    },
    {
        name: 'SECOND',
        field: 'second',
        sortable: false
    }]
};

export const StatusTableWithTableCard = Template.bind({});
StatusTableWithTableCard.args = {
    headers: [{
        name: 'FIRST',
        field: 'first',
        sortable: true
    },
    {
        name: 'SECOND',
        field: 'second',
        sortable: false
    }],
    cards: true
};

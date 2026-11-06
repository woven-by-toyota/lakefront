import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import { useState } from 'react';
import TransferListComponent, { type ListItem, type TransferListProps } from 'src/components/TransferList';

const JOB_TYPES_1: ListItem[] = [
    { label: 'Finished', description: 'finished', value: 'finished' },
    { label: 'Cancelled', description: 'cancelled', value: 'canceled' },
    { label: 'Failed', description: 'failed', value: 'failed' },
    { label: 'Running', description: 'running', value: 'running' }
];

const JOB_TYPES_2: ListItem[] = [{ label: 'Pending', description: 'pending', value: 'enqueued' }];

export default {
    title: 'LakeFront/TransferList',
    component: TransferListComponent,
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<TransferListProps> = (args) => {
    const [currentJobStateList, setCurrentJobStateList] = useState<ListItem[]>(args.leftListData);
    const [availableJobStateList, setAvailableJobStateList] = useState<ListItem[]>(args.rightListData);

    const handleListChange = (leftList: ListItem[], rightList: ListItem[]) => {
        setCurrentJobStateList(leftList);
        setAvailableJobStateList(rightList);
    };

    return (
        <TransferListComponent
            leftListData={currentJobStateList}
            leftListName={args.leftListName}
            rightListData={availableJobStateList}
            rightListName={args.rightListName}
            onListChange={handleListChange}
        />
    );
};

export const TransferList = Template.bind({});
TransferList.args = {
    leftListData: JOB_TYPES_1,
    leftListName: 'Current Job States',
    rightListData: JOB_TYPES_2,
    rightListName: 'Available Job States'
};

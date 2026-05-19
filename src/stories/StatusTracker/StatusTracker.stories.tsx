import { Meta, StoryFn } from '@storybook/react-webpack5';
import StatusTracker, { StatusTrackerProps } from 'src/components/StatusTracker/StatusTracker';
import DocBlock from '.storybook/DocBlock';
import { green, saturatedBlue, saturatedOrange, saturatedRed } from 'src/styles/lakefrontColors';

export default {
    title: 'Lakefront/StatusTracker',
    component: StatusTracker,
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<StatusTrackerProps> = (args) => (
    <div style={{ padding: '40px', maxWidth: '800px' }}>
        <StatusTracker {...args} />
    </div>
);

export const BasicStatusTracker = Template.bind({});
BasicStatusTracker.args = {
    statuses: [
        { label: 'Started' },
        { label: 'In Progress' },
        { label: 'Review' },
        { label: 'Complete' }
    ]
};

export const WithDescriptions = Template.bind({});
WithDescriptions.args = {
    statuses: [
        { label: 'Started', description: '2024-01-15 10:30 AM' },
        { label: 'In Progress', description: '2024-01-15 11:45 AM' },
        { label: 'Review', description: '2024-01-15 02:15 PM' },
        { label: 'Complete', description: '2024-01-15 04:30 PM' }
    ]
};

export const WithAboveDetails = Template.bind({});
WithAboveDetails.args = {
    statuses: [
        { label: 'Started', aboveDetails: 'John Doe' },
        { label: 'In Progress', aboveDetails: 'Jane Smith' },
        { label: 'Review', aboveDetails: 'Bob Johnson' },
        { label: 'Complete', aboveDetails: 'Alice Williams' }
    ]
};

export const CompleteExample = Template.bind({});
CompleteExample.args = {
    statuses: [
        {
            label: 'Submitted',
            description: '2024-01-15 10:30 AM',
            aboveDetails: 'John Doe',
            color: green
        },
        {
            label: 'Processing',
            description: '2024-01-15 11:45 AM',
            aboveDetails: 'System',
            color: saturatedBlue
        },
        {
            label: 'Under Review',
            description: '2024-01-15 02:15 PM',
            aboveDetails: 'Jane Smith',
            color: saturatedOrange
        },
        {
            label: 'Approved',
            description: '2024-01-15 04:30 PM',
            aboveDetails: 'Manager',
            color: green
        }
    ]
};

export const CustomColors = Template.bind({});
CustomColors.args = {
    statuses: [
        { label: 'Success', color: green },
        { label: 'Warning', color: saturatedOrange },
        { label: 'Error', color: saturatedRed },
        { label: 'Info', color: saturatedBlue }
    ]
};

export const TwoStatuses = Template.bind({});
TwoStatuses.args = {
    statuses: [
        { label: 'Start', description: 'Beginning', color: green },
        { label: 'End', description: 'Completed', color: saturatedBlue }
    ]
};

export const ManyStatuses = Template.bind({});
ManyStatuses.args = {
    statuses: [
        { label: 'Step 1', color: green },
        { label: 'Step 2', color: green },
        { label: 'Step 3', color: saturatedBlue },
        { label: 'Step 4', color: saturatedOrange },
        { label: 'Step 5', color: saturatedOrange },
        { label: 'Step 6', color: saturatedRed }
    ]
};

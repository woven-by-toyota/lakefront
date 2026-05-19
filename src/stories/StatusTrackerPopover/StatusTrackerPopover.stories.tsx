import { Meta, StoryFn } from '@storybook/react-webpack5';
import StatusTrackerPopover, { StatusTrackerPopoverProps } from 'src/components/StatusTrackerPopover/StatusTrackerPopover';
import DocBlock from '.storybook/DocBlock';
import Button from 'src/components/Button/Button';
import { green, saturatedBlue, saturatedOrange } from 'src/styles/lakefrontColors';

export default {
    title: 'Lakefront/StatusTrackerPopover',
    component: StatusTrackerPopover,
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<StatusTrackerPopoverProps> = (args) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 300, marginTop: 50 }}>
        <StatusTrackerPopover {...args}>
            <Button>View Status</Button>
        </StatusTrackerPopover>
    </div>
);


export const WithActiveState = Template.bind({});
WithActiveState.args = {
    visible: true,
    statuses: [
        { label: 'Completed', description: '10:30 AM', color: green },
        { label: 'In Progress', description: '11:45 AM', color: saturatedBlue, active: true },
        { label: 'Pending', description: '12:30 PM', color: saturatedOrange },
        { label: 'Not Started', description: '' }
    ]
};

export const BasicPopover = Template.bind({});
BasicPopover.args = {
    visible: true,
    statuses: [
        { label: 'Started' },
        { label: 'In Progress' },
        { label: 'Review' },
        { label: 'Complete' }
    ]
};

export const WithDescriptions = Template.bind({});
WithDescriptions.args = {
    visible: true,
    statuses: [
        { label: 'Started', description: '2024-01-15 10:30 AM' },
        { label: 'In Progress', description: '2024-01-15 11:45 AM' },
        { label: 'Review', description: '2024-01-15 02:15 PM' },
        { label: 'Complete', description: '2024-01-15 04:30 PM' }
    ]
};

export const CompleteExample = Template.bind({});
CompleteExample.args = {
    visible: true,
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

export const PopoverInPortal = Template.bind({});
PopoverInPortal.args = {
    visible: true,
    renderInPortal: true,
    statuses: [
        { label: 'Started', description: '2024-01-15 10:30 AM', color: green },
        { label: 'In Progress', description: '2024-01-15 11:45 AM', color: saturatedBlue },
        { label: 'Complete', description: '2024-01-15 04:30 PM', color: green }
    ]
};

const IconButtonTemplate: StoryFn<StatusTrackerPopoverProps> = (args) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 300, marginTop: 50 }}>
        <StatusTrackerPopover {...args}>
            <Button icon={true} />
        </StatusTrackerPopover>
    </div>
);

export const WithIconButton = IconButtonTemplate.bind({});
WithIconButton.args = {
    visible: true,
    statuses: [
        { label: 'Step 1', aboveDetails: 'User A', color: green },
        { label: 'Step 2', aboveDetails: 'User B', color: saturatedBlue },
        { label: 'Step 3', aboveDetails: 'User C', color: saturatedOrange }
    ]
};

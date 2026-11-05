import type { Meta, StoryFn } from '@storybook/react-webpack5';
import MoreActionsButton, { type MoreActionsButtonProps } from '../../components/MoreActionsButton/MoreActionsButton';

export default {
    title: 'Lakefront/MoreActionsButton',
    component: MoreActionsButton,
    argTypes: {
        items: {
            control: 'object',
            description: 'The array of action items to display in the menu.'
        }
    }
} as Meta;

const Template: StoryFn<MoreActionsButtonProps> = (args) => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MoreActionsButton {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    items: [
        { name: 'View Details', onClick: () => alert('Viewing details!') },
        { name: 'Edit Item', onClick: () => alert('Editing item!') },
        { name: 'Share', onClick: () => alert('Sharing!') },
        { name: 'Archive', onClick: () => alert('Archiving!'), disabled: true }
    ]
};

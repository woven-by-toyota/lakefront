import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import Button from 'src/components/Button/Button';
import SelectPopover, { type SelectPopoverProps } from 'src/components/SelectPopover/SelectPopover';
import { blue } from 'src/styles/lakefrontColors';

export default {
    title: 'Lakefront/SelectPopover',
    component: SelectPopover,
    argTypes: {
        handleClick: {
            action: 'clicked'
        },
        children: {
            table: {
                disable: true
            }
        }
    },
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<SelectPopoverProps> = (args) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 200 }}>
        <SelectPopover {...args}>
            <Button icon={true} />
        </SelectPopover>
    </div>
);

export const Popover = Template.bind({});
const options = [
    { name: 'Test 1', value: '1' },
    { name: 'Test 2', value: 2 },
    { name: 'Test 3', value: { value: 3 } },
    { name: 'Test 4 (Disabled)', value: 4, disabled: true },
    { name: <div style={{ backgroundColor: blue, padding: 5 }}>React Element</div>, value: 5 }
];

Popover.args = {
    options,
    visible: true
};

export const PopoverPortal = Template.bind({});

PopoverPortal.args = {
    options,
    visible: true,
    renderInPortal: true
};
